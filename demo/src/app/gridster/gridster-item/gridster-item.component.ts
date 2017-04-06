import { Component, OnInit, ElementRef, Inject, Host, Input, Output, ViewChild,
    EventEmitter, SimpleChange, OnChanges, OnDestroy, HostBinding, HostListener,
    ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ISubscription, Subscription } from 'rxjs/Subscription';

import { GridsterService } from '../gridster.service';
import { GridListItem } from '../gridList/GridListItem';
import {DraggableEvent} from '../utils/DraggableEvent';
import {Draggable} from '../utils/draggable';

@Component({
    selector: 'gridster-item',
    template: `<div class="gridster-item-inner">
      <ng-content></ng-content>
      <div *ngIf="gridster.options.resizable" class="gridster-item-resizable-handler handle-s"></div>
      <div *ngIf="gridster.options.resizable" class="gridster-item-resizable-handler handle-e"></div>
      <div *ngIf="gridster.options.resizable" class="gridster-item-resizable-handler handle-n"></div>
      <div *ngIf="gridster.options.resizable" class="gridster-item-resizable-handler handle-w"></div>
      <div *ngIf="gridster.options.resizable" class="gridster-item-resizable-handler handle-se"></div>
      <div *ngIf="gridster.options.resizable" class="gridster-item-resizable-handler handle-ne"></div>
      <div *ngIf="gridster.options.resizable" class="gridster-item-resizable-handler handle-sw"></div>
      <div *ngIf="gridster.options.resizable" class="gridster-item-resizable-handler handle-nw"></div>
    </div>`,
    styles: [`
    :host {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        cursor: pointer;
        -webkit-transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, font-size 0.2s, line-height 0.2s;
        transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, font-size 0.2s, line-height 0.2s;
    }

    :host.is-dragging, :host.is-resizing {
        -webkit-transition: none;
        transition: none;
        z-index: 9999;
    }

    :host.no-transition {
        -webkit-transition: none;
        transition: none;
    }
    .gridster-item-resizable-handler {
        position: absolute;
        z-index: 2;
    }

    .gridster-item-resizable-handler.handle-n {
      cursor: n-resize;
      height: 10px;
      right: 0;
      top: 0;
      left: 0;
    }

    .gridster-item-resizable-handler.handle-e {
      cursor: e-resize;
      width: 10px;
      bottom: 0;
      right: 0;
      top: 0;
    }

    .gridster-item-resizable-handler.handle-s {
      cursor: s-resize;
      height: 10px;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .gridster-item-resizable-handler.handle-w {
      cursor: w-resize;
      width: 10px;
      left: 0;
      top: 0;
      bottom: 0;
    }

    .gridster-item-resizable-handler.handle-ne {
      cursor: ne-resize;
      width: 10px;
      height: 10px;
      right: 0;
      top: 0;
    }

    .gridster-item-resizable-handler.handle-nw {
      cursor: nw-resize;
      width: 10px;
      height: 10px;
      left: 0;
      top: 0;
    }

    .gridster-item-resizable-handler.handle-se {
      cursor: se-resize;
      width: 0;
      height: 0;
      right: 0;
      bottom: 0;
      border-style: solid;
      border-width: 0 0 10px 10px;
      border-color: transparent;
    }

    .gridster-item-resizable-handler.handle-sw {
      cursor: sw-resize;
      width: 10px;
      height: 10px;
      left: 0;
      bottom: 0;
    }

    :host(:hover) .gridster-item-resizable-handler.handle-se {
      border-color: transparent transparent #ccc
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridsterItemComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() x: number;
    @Output() xChange = new EventEmitter<number>();
    @Input() y: number;
    @Output() yChange = new EventEmitter<number>();
    @Input() w: number;
    @Output() wChange = new EventEmitter<number>();
    @Input() h: number;
    @Output() hChange = new EventEmitter<number>();

    autoSize: boolean;

    @HostBinding('class.is-dragging') isDragging = false;
    @HostBinding('class.is-resizing') isResizing = false;

    $element: HTMLElement;
    /**
     * Gridster provider service
     */
    gridster: GridsterService;

    item: GridListItem;

    private subscriptions: Array<Subscription> = [];

    constructor(private cdr: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Host() gridster: GridsterService) {

        this.gridster = gridster;

        this.$element = elementRef.nativeElement;

        this.item = (new GridListItem()).setFromGridsterItem(this);

        // if gridster is initialized do not show animation on new grid-item construct
        if (this.gridster.$element) {
            this.preventAnimation();
        }
    }

    ngAfterViewInit() {
        if (this.gridster.options.resizable) {
            this.enableResizable();
        }

        this.cdr.detach();
    }

    ngOnInit() {
        this.gridster.registerItem(this.item);
        //  only if new item is registered after bootstrap
        if (this.gridster.$element) {

            this.gridster.gridList.resolveCollisions(this.item);
            this.gridster.reflow();
        }

        if (this.gridster.options.dragAndDrop) {
            this.enableDragDrop();
        }
    }

    ngOnChanges() {
        if (!this.gridster.gridList) {
            return;
        }

        this.gridster.gridList.resolveCollisions(this.item);
        this.gridster.render();
    }

    ngOnDestroy() {
        const index = this.gridster.items.indexOf(this.item);
        if (index >= 0) {
            this.gridster.items.splice(index, 1);
        }

        this.gridster.gridList.pullItemsToLeft();
        this.gridster.render();

        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }

    private enableResizable() {
        [].forEach.call(this.$element.querySelectorAll('.gridster-item-resizable-handler'), (handler) => {
            const draggable = new Draggable(handler);

            let direction;
            let startEvent;
            let startData;
            let cursorToElementPosition;

            const dragStartSub = draggable.dragStart
                .subscribe((event: DraggableEvent) => {
                    this.isResizing = true;
                    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                    startEvent = event;
                    startData = {
                        top: parseInt(this.$element.style.top, 10),
                        left: parseInt(this.$element.style.left, 10),
                        height: parseInt(this.$element.style.height, 10),
                        width: parseInt(this.$element.style.width, 10),
                        scrollLeft,
                        scrollTop
                    };
                    cursorToElementPosition = event.getRelativeCoordinates(this.$element);
                    direction = this.getResizeDirection(handler);

                    this.gridster.onResizeStart(this.item);
                });

            const dragSub = draggable.dragMove
                .subscribe((event: DraggableEvent) => {
                    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                    this.resizeElement({
                        direction,
                        startData,
                        position: {
                            x: event.clientX - cursorToElementPosition.x -
                                this.gridster.gridsterOffset.left - this.gridster.gridsterRect.left,
                            y: event.clientY - cursorToElementPosition.y -
                                this.gridster.gridsterOffset.top - this.gridster.gridsterRect.top
                        },
                        startEvent,
                        moveEvent: event,
                        scrollDiffX: scrollLeft - startData.scrollLeft,
                        scrollDiffY: scrollTop - startData.scrollTop
                    });

                    this.gridster.onResizeDrag(this.item);
                });

            const dragStopSub = draggable.dragStop
                .subscribe(() => {
                    this.isResizing = false;

                    this.gridster.onResizeStop(this.item);
                });

            this.subscriptions = this.subscriptions.concat([dragStartSub, dragSub, dragStopSub]);
        });
    }

    private enableDragDrop() {
        let cursorToElementPosition;
        const draggable = new Draggable(this.$element, {
                handlerClass: this.gridster.draggableOptions.handlerClass
            });

        const dragStartSub = draggable.dragStart
            .subscribe((event: DraggableEvent) => {
                this.gridster.onStart(this.item);
                this.isDragging = true;

                cursorToElementPosition = event.getRelativeCoordinates(this.$element);
            });

        const dragSub = draggable.dragMove
            .subscribe((event: DraggableEvent) => {
                this.$element.style.top = (event.clientY - cursorToElementPosition.y -
                        this.gridster.gridsterOffset.top - this.gridster.gridsterRect.top) + 'px';
                this.$element.style.left = (event.clientX - cursorToElementPosition.x -
                        this.gridster.gridsterOffset.left - this.gridster.gridsterRect.left) + 'px';

                this.gridster.onDrag(this.item);
            });

        const dragStopSub = draggable.dragStop
            .subscribe(() => {
                this.gridster.onStop(this.item);
                this.isDragging = false;
            });

        this.subscriptions = this.subscriptions.concat([dragStartSub, dragSub, dragStopSub]);
    }

    /**
     * Assign class for short while to prevent animation of grid item component
     * @returns {GridsterItemComponent}
     */
    private preventAnimation(): GridsterItemComponent {
        this.$element.classList.add('no-transition');
        setTimeout(() => {
            this.$element.classList.remove('no-transition');
        }, 500);

        return this;
    }

    private getResizeDirection(handler: Element): string {
        for (let i = handler.classList.length - 1; i >= 0; i--) {
            if (handler.classList[i].match('handle-')) {
                return handler.classList[i].split('-')[1];
            }
        }
    }

    private resizeElement(config: any): void {
        // north
        if (config.direction.indexOf('n') >= 0) {
            this.resizeToNorth(config);
        }
        // west
        if (config.direction.indexOf('w') >= 0) {
            this.resizeToWest(config);
        }
        // east
        if (config.direction.indexOf('e') >= 0) {
            this.resizeToEast(config);
        }
        // south
        if (config.direction.indexOf('s') >= 0) {
            this.resizeToSouth(config);
        }
    }

    private resizeToNorth(config: any): void {
        const height = config.startData.height + config.startEvent.clientY - config.moveEvent.clientY - config.scrollDiffY;

        if (this.isLessThanMinHeight(height)) { // lest than min
            this.setMinHeight('n');
        } else if (this.isMoreThanMaxHeight(height, 'n')) { // more than max
            this.setMaxHeight('n');
        } else {
            this.$element.style.top = config.position.y + 'px';
            this.$element.style.height = height + 'px';
        }
    }

    private resizeToWest(config: any): void {
        const width = config.startData.width + config.startEvent.clientX - config.moveEvent.clientX - config.scrollDiffX;

        if (this.isLessThanMinWidth(width)) { // lest than min
            this.setMinWidth('w');
        } else if (this.isMoreThanMaxWidth(width, 'w')) { // more than max
            this.setMaxWidth('w');
        } else {
            this.$element.style.left = config.position.x + 'px';
            this.$element.style.width = width + 'px';
        }
    }

    private resizeToEast(config: any): void {
        const width = config.startData.width + config.moveEvent.clientX - config.startEvent.clientX + config.scrollDiffX;

        if (this.isMoreThanMaxWidth(width, 'e')) {
            this.setMaxWidth('e');
        } else if (this.isLessThanMinWidth(width)) {
            this.setMinWidth('e');
        } else {
            this.$element.style.width = width + 'px';
        }
    }

    private resizeToSouth(config: any): void {
        const height = config.startData.height + config.moveEvent.clientY - config.startEvent.clientY + config.scrollDiffY;

        if (this.isMoreThanMaxHeight(height, 's')) {
            this.setMaxHeight('s');
        } else if (this.isLessThanMinHeight(height)) {
            this.setMinHeight('s');
        } else {
            this.$element.style.height = height + 'px';
        }
    }

    private isLessThanMinHeight(height: number): boolean {
        return (this.gridster.cellHeight * this.gridster.options.minHeight) > height;
    }

    private setMinHeight(direction: string): void {
        if(direction === 'n') {
            this.$element.style.height = (this.gridster.options.minHeight * this.gridster.cellHeight) + 'px';
            this.$element.style.top =
                ((this.item.y + this.item.h - this.gridster.options.minHeight) * this.gridster.cellHeight) + 'px';
        }
        else {
            this.$element.style.height = (this.gridster.options.minHeight * this.gridster.cellHeight) + 'px';
        }
    }

    private isLessThanMinWidth(width: number): boolean {
        return (this.gridster.cellWidth * this.gridster.options.minWidth) > width;
    }

    private setMinWidth(direction: string): void {
        if(direction === 'w') {
            this.$element.style.width = (this.gridster.options.minWidth * this.gridster.cellWidth) + 'px';
            this.$element.style.left =
                ((this.item.x + this.item.w - this.gridster.options.minWidth) * this.gridster.cellWidth) + 'px';
        }
        else {
            this.$element.style.width = (this.gridster.options.minWidth * this.gridster.cellWidth) + 'px';
        }
    }

    private isMoreThanMaxHeight(height: number, direction: string): boolean {
        let maxHeight;

        if(direction === 'n') {
            maxHeight = Math.min(
                    (this.item.y + this.item.h),
                    this.gridster.options.maxHeight || (this.item.y + this.item.h)
                ) * this.gridster.cellHeight;

            return maxHeight < height;
        }
        else {
            maxHeight = Math.min(
                    (this.gridster.options.lanes - this.item.y),
                    this.gridster.options.maxHeight || (this.gridster.options.lanes - this.item.y)
                ) * this.gridster.cellHeight;

            return maxHeight < height;
        }
    }

    private setMaxHeight(direction: string): void {
        let maxHeight;

        if(direction === 'n') {
            maxHeight = Math.min(
                    (this.item.y + this.item.h),
                    this.gridster.options.maxHeight || (this.item.y + this.item.h)
                ) * this.gridster.cellHeight;

            this.$element.style.height = maxHeight + 'px';
            this.$element.style.top = 0 + 'px';
        }
        else {
            maxHeight = Math.min(
                    (this.gridster.options.lanes - this.item.y),
                    this.gridster.options.maxHeight || (this.gridster.options.lanes - this.item.y)
                ) * this.gridster.cellHeight;

            this.$element.style.height = maxHeight + 'px';
        }
     }

    private isMoreThanMaxWidth(width: number, direction: string): boolean {
        let maxWidth;

        if(direction === 'w') {
            maxWidth = Math.min(
                    (this.item.x + this.item.w),
                    this.gridster.options.maxWidth || (this.item.x + this.item.w)
                ) * this.gridster.cellWidth;

            return maxWidth < width;
        }
        else {
            maxWidth = Math.min(
                    (this.gridster.options.lanes - this.item.x),
                    this.gridster.options.maxWidth || (this.gridster.options.lanes - this.item.x)
                ) * this.gridster.cellWidth;

            return maxWidth < width;
        }
    }

    private setMaxWidth(direction: string): void {
        let maxWidth;

        if(direction === 'w') {
            maxWidth = Math.min(
                    (this.item.x + this.item.w),
                    this.gridster.options.maxWidth || (this.item.x + this.item.w)
                ) * this.gridster.cellWidth;

            this.$element.style.width = maxWidth + 'px';
            this.$element.style.left = 0 + 'px';
        }
        else {
            maxWidth = Math.min(
                    (this.gridster.options.lanes - this.item.x),
                    this.gridster.options.maxWidth || (this.gridster.options.lanes - this.item.x)
                ) * this.gridster.cellWidth;

            this.$element.style.width = maxWidth + 'px';
        }
    }
}
