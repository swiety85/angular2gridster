import { Component, OnInit, ElementRef, Inject, Host, Input, Output, ViewChild,
    EventEmitter, SimpleChanges, OnChanges, OnDestroy, HostBinding, HostListener,
    ChangeDetectionStrategy, AfterViewInit, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { GridsterService } from '../gridster.service';
import { GridListItem } from '../gridList/GridListItem';
import {DraggableEvent} from '../utils/DraggableEvent';
import {Draggable} from '../utils/draggable';
import {IGridsterOptions} from '../IGridsterOptions';
import {GridList} from '../gridList/gridList';
import {utils} from '../utils/utils';

@Component({
    selector: 'gridster-item',
    template: `<div class="gridster-item-inner">
      <ng-content></ng-content>
      <div class="gridster-item-resizable-handler handle-s"></div>
      <div class="gridster-item-resizable-handler handle-e"></div>
      <div class="gridster-item-resizable-handler handle-n"></div>
      <div class="gridster-item-resizable-handler handle-w"></div>
      <div class="gridster-item-resizable-handler handle-se"></div>
      <div class="gridster-item-resizable-handler handle-ne"></div>
      <div class="gridster-item-resizable-handler handle-sw"></div>
      <div class="gridster-item-resizable-handler handle-nw"></div>
    </div>`,
    styles: [`
    :host {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        -webkit-transition: none;
        transition: none;
    }

    :host-context(.gridster--ready) {
        transition: all 200ms ease;
        transition-property: left, top;
    }

    :host-context(.gridster--ready.css-transform)  {
        transition-property: transform;
    }

    :host-context(.gridster--ready).is-dragging, :host-context(.gridster--ready).is-resizing {
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
        display: none;
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

    @Input() xSm: number;
    @Output() xSmChange = new EventEmitter<number>();
    @Input() ySm: number;
    @Output() ySmChange = new EventEmitter<number>();

    @Input() xMd: number;
    @Output() xMdChange = new EventEmitter<number>();
    @Input() yMd: number;
    @Output() yMdChange = new EventEmitter<number>();

    @Input() xLg: number;
    @Output() xLgChange = new EventEmitter<number>();
    @Input() yLg: number;
    @Output() yLgChange = new EventEmitter<number>();

    @Input() xXl: number;
    @Output() xXlChange = new EventEmitter<number>();
    @Input() yXl: number;
    @Output() yXlChange = new EventEmitter<number>();


    @Input() w: number;
    @Output() wChange = new EventEmitter<number>();
    @Input() h: number;
    @Output() hChange = new EventEmitter<number>();

    @Output() change = new EventEmitter<any>();
    @Output() start = new EventEmitter<any>();
    @Output() end = new EventEmitter<any>();

    @Input() dragAndDrop = true;
    @Input() resizable = true;

    @Input() options: any = {};

    autoSize: boolean;

    @HostBinding('class.is-dragging') isDragging = false;
    @HostBinding('class.is-resizing') isResizing = false;

    $element: HTMLElement;
    elementRef: ElementRef;
    /**
     * Gridster provider service
     */
    gridster: GridsterService;

    item: GridListItem;

    set positionX(value: number) {
        this._positionX = value;
    }
    get positionX() {
        return this._positionX;
    }
    set positionY(value: number) {
        this._positionY = value;
    }
    get positionY() {
        return this._positionY;
    }
    private _positionX: number;
    private _positionY: number;

    private defaultOptions: any = {
        minWidth: 1,
        minHeight: 1,
        maxWidth: Infinity,
        maxHeight: Infinity,
        defaultWidth: 1,
        defaultHeight: 1
    };
    private subscriptions: Array<Subscription> = [];
    private dragSubscriptions: Array<Subscription> = [];
    private resizeSubscriptions: Array<Subscription> = [];

    constructor(private zone: NgZone,
                @Inject(ElementRef) elementRef: ElementRef,
                @Host() gridster: GridsterService) {

        this.gridster = gridster;
        this.elementRef = elementRef;
        this.$element = elementRef.nativeElement;

        this.item = (new GridListItem()).setFromGridsterItem(this);

        // if gridster is initialized do not show animation on new grid-item construct
        if (this.gridster.isInitialized()) {
            this.preventAnimation();
        }
    }

    ngOnInit() {
        this.options = Object.assign(this.defaultOptions, this.options);

        this.w = this.w || this.options.defaultWidth;
        this.h = this.h || this.options.defaultHeight;

        if (this.gridster.isInitialized()) {
            if (this.x || this.x === 0) {
                this.item.setValueX(this.x, this.gridster.options.breakpoint);
            }
            if (this.y || this.y === 0) {
                this.item.setValueY(this.y, this.gridster.options.breakpoint);
            }
            this.setPositionsOnItem();
        }

        this.gridster.registerItem(this.item);

        this.gridster.calculateCellSize();
        this.item.applySize();
        this.item.applyPosition();

        if (this.dragAndDrop) {
            this.enableDragDrop();
        }

        if (this.gridster.isInitialized()) {
            this.gridster.render();
        }
    }

    ngAfterViewInit() {
        if (this.gridster.options.resizable && this.item.resizable) {
            this.enableResizable();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.gridster.gridList) {
            return;
        }

        if (changes['dragAndDrop'] && !changes['dragAndDrop'].isFirstChange()) {
            if (changes['dragAndDrop'].currentValue && this.gridster.options.dragAndDrop) {
                this.enableDragDrop();
            } else {
                this.disableDraggable();
            }
        }
        if (changes['resizable'] && !changes['resizable'].isFirstChange()) {
            if (changes['resizable'].currentValue) {
                this.enableResizable();
            } else {
                this.disableResizable();
            }
        }
        if (changes['w'] && !changes['w'].isFirstChange()) {
            if (changes['w'].currentValue > this.options.maxWidth) {
                this.w = this.options.maxWidth;
                setTimeout(() => {
                    this.wChange.emit(this.w);
                });
            }
        }
        if (changes['h'] && !changes['h'].isFirstChange()) {
            if (changes['h'].currentValue > this.options.maxHeight) {
                this.h = this.options.maxHeight;
                setTimeout(() => {
                    this.hChange.emit(this.h);
                });
            }
        }
    }

    ngOnDestroy() {
        this.gridster.removeItem(this.item);
        this.gridster.gridList.pullItemsToLeft();
        this.gridster.render();

        this.gridster.updateCachedItems();

        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
        this.disableDraggable();
        this.disableResizable();
    }

    updateElemenetPosition() {
        if (this.gridster.options.useCSSTransforms) {
            utils.setTransform(this.$element, {x: this._positionX, y: this._positionY});
        } else {
            utils.setCssElementPosition(this.$element, {x: this._positionX, y: this._positionY});
        }
    }

    setPositionsOnItem() {
        if (!this.item.hasPositions(null)) {
            this.setPositionsForGrid(this.gridster.gridsterOptions.basicOptions);
        }

        this.gridster.gridsterOptions.responsiveOptions
            .filter((options: IGridsterOptions) => !this.item.hasPositions(options.breakpoint))
            .forEach((options: IGridsterOptions) => this.setPositionsForGrid(options));
    }

    public enableResizable() {
        if (this.resizeSubscriptions.length || !this.resizable) {
            return;
        }

        this.zone.runOutsideAngular(() => {
            [].forEach.call(this.$element.querySelectorAll('.gridster-item-resizable-handler'), (handler) => {
                handler.style.display = 'block';
                const draggable = new Draggable(handler, this.getResizableOptions());

                let direction;
                let startEvent;
                let startData;
                let cursorToElementPosition;

                const dragStartSub = draggable.dragStart
                    .subscribe((event: DraggableEvent) => {
                        this.zone.run(() => {
                            this.isResizing = true;

                            startEvent = event;
                            direction = this.getResizeDirection(handler);
                            startData = this.createResizeStartObject(direction);
                            cursorToElementPosition = event.getRelativeCoordinates(this.$element);

                            this.gridster.onResizeStart(this.item);
                            this.onStart('resize');
                        });
                    });

                const dragSub = draggable.dragMove
                    .subscribe((event: DraggableEvent) => {
                        const scrollData = this.gridster.gridsterScrollData;

                        this.resizeElement({
                            direction,
                            startData,
                            position: {
                                x: event.clientX - cursorToElementPosition.x - this.gridster.gridsterRect.left,
                                y: event.clientY - cursorToElementPosition.y - this.gridster.gridsterRect.top
                            },
                            startEvent,
                            moveEvent: event,
                            scrollDiffX: scrollData.scrollLeft - startData.scrollLeft,
                            scrollDiffY: scrollData.scrollTop - startData.scrollTop
                        });

                        this.gridster.onResizeDrag(this.item);
                    });

                const dragStopSub = draggable.dragStop
                    .subscribe(() => {
                        this.zone.run(() => {
                            this.isResizing = false;

                            this.gridster.onResizeStop(this.item);
                            this.onEnd('resize');
                        });
                    });

                this.resizeSubscriptions = this.resizeSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);

            });
        });
    }

    public disableResizable() {
        this.resizeSubscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
        this.resizeSubscriptions = [];

        [].forEach.call(this.$element.querySelectorAll('.gridster-item-resizable-handler'), (handler) => {
            handler.style.display = '';
        });
    }

    public enableDragDrop() {
        if (this.dragSubscriptions.length) {
            return;
        }
        this.zone.runOutsideAngular(() => {
            let cursorToElementPosition;

            const draggable = new Draggable(this.$element, this.gridster.draggableOptions);

            const dragStartSub = draggable.dragStart
                .subscribe((event: DraggableEvent) => {
                    this.zone.run(() => {
                        this.gridster.onStart(this.item);
                        this.isDragging = true;
                        this.onStart('drag');

                        cursorToElementPosition = event.getRelativeCoordinates(this.$element);
                    });
                });

            const dragSub = draggable.dragMove
                .subscribe((event: DraggableEvent) => {

                    this.positionY = (event.clientY - cursorToElementPosition.y -
                        this.gridster.gridsterRect.top);
                    this.positionX = (event.clientX - cursorToElementPosition.x -
                        this.gridster.gridsterRect.left);
                    this.updateElemenetPosition();

                    this.gridster.onDrag(this.item);
                });

            const dragStopSub = draggable.dragStop
                .subscribe(() => {
                    this.zone.run(() => {
                        this.gridster.onStop(this.item);
                        this.gridster.render();
                        this.isDragging = false;
                        this.onEnd('drag');
                    });
                });

            this.dragSubscriptions = this.dragSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);
        });
    }

    public disableDraggable() {
        this.dragSubscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
        this.dragSubscriptions = [];
    }

    private getResizableOptions() {
        const resizableOptions: any = {};

        if (this.gridster.draggableOptions.scroll) {
            resizableOptions.scroll = this.gridster.draggableOptions.scroll;
            resizableOptions.scrollEdge = this.gridster.draggableOptions.scrollEdge;
        }

        return resizableOptions;
    }

    private setPositionsForGrid(options) {
        let x, y;

        const position = this.findPosition(options);
        x = options.direction === 'horizontal' ? position[0] : position[1];
        y = options.direction === 'horizontal' ? position[1] : position[0];

        this.item.setValueX(x, options.breakpoint);
        this.item.setValueY(y, options.breakpoint);

        setTimeout(() => {
            this.item.triggerChangeX(options.breakpoint);
            this.item.triggerChangeY(options.breakpoint);
        });
    }

    private findPosition(options: IGridsterOptions): Array<number> {
        const gridList = new GridList(
            this.gridster.items.map(item => item.copyForBreakpoint(options.breakpoint)),
            options
        );

        return gridList.findPositionForItem(this.item, {x: 0, y: 0});
    }

    private createResizeStartObject(direction: string) {
        const scrollData = this.gridster.gridsterScrollData;

        return {
            top: this.positionY,
            left: this.positionX,
            height: parseInt(this.$element.style.height, 10),
            width: parseInt(this.$element.style.width, 10),
            minX: Math.max(this.item.x + this.item.w - this.options.maxWidth, 0),
            maxX: this.item.x + this.item.w - this.options.minWidth,
            minY: Math.max(this.item.y + this.item.h - this.options.maxHeight, 0),
            maxY: this.item.y + this.item.h - this.options.minHeight,
            minW: this.options.minWidth,
            maxW: Math.min(
                this.options.maxWidth,
                (this.gridster.options.direction === 'vertical' && direction.indexOf('w') < 0) ?
                this.gridster.options.lanes - this.item.x : this.options.maxWidth,
                direction.indexOf('w') >= 0 ?
                this.item.x + this.item.w : this.options.maxWidth
            ),
            minH: this.options.minHeight,
            maxH: Math.min(
                this.options.maxHeight,
                (this.gridster.options.direction === 'horizontal' && direction.indexOf('n') < 0) ?
                this.gridster.options.lanes - this.item.y : this.options.maxHeight,
                direction.indexOf('n') >= 0 ?
                this.item.y + this.item.h : this.options.maxHeight
            ),
            scrollLeft: scrollData.scrollLeft,
            scrollTop: scrollData.scrollTop
        };
    }

    private onEnd(actionType: string): void {
        this.end.emit({action: actionType, item: this.item});
    }

    private onStart(actionType: string): void {
        this.start.emit({action: actionType, item: this.item});
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
        const height = config.startData.height + config.startEvent.clientY -
            config.moveEvent.clientY - config.scrollDiffY;

        if (height < (config.startData.minH * this.gridster.cellHeight)) {
            this.setMinHeight('n', config);
        } else if (height > (config.startData.maxH * this.gridster.cellHeight)) {
            this.setMaxHeight('n', config);
        } else {
            this.positionY = config.position.y;
            this.$element.style.height = height + 'px';
        }
    }

    private resizeToWest(config: any): void {
        const width = config.startData.width + config.startEvent.clientX -
            config.moveEvent.clientX - config.scrollDiffX;

        if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('w', config);
        } else if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('w', config);
        } else {
            this.positionX = config.position.x;
            this.updateElemenetPosition();
            this.$element.style.width = width + 'px';
        }
    }

    private resizeToEast(config: any): void {
        const width = config.startData.width + config.moveEvent.clientX -
            config.startEvent.clientX + config.scrollDiffX;

        if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('e', config);
        } else if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('e', config);
        } else {
            this.$element.style.width = width + 'px';
        }
    }

    private resizeToSouth(config: any): void {
        const height = config.startData.height + config.moveEvent.clientY -
            config.startEvent.clientY + config.scrollDiffY;

        if (height > config.startData.maxH * this.gridster.cellHeight) {
            this.setMaxHeight('s', config);
        } else if (height < config.startData.minH * this.gridster.cellHeight) {
            this.setMinHeight('s', config);
        } else {
            this.$element.style.height = height + 'px';
        }
    }

    private setMinHeight(direction: string, config: any): void {
        if (direction === 'n') {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
            this.positionY = config.startData.maxY * this.gridster.cellHeight;
        } else {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
        }
    }

    private setMinWidth(direction: string, config: any): void {
        if (direction === 'w') {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
            this.positionX = config.startData.maxX * this.gridster.cellWidth;
            this.updateElemenetPosition();
        } else {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
        }
    }

    private setMaxHeight(direction: string, config: any): void {

        if (direction === 'n') {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
            this.positionY = config.startData.minY * this.gridster.cellHeight;
        } else {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
        }
    }

    private setMaxWidth(direction: string, config: any): void {

        if (direction === 'w') {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
            this.positionX = config.startData.minX * this.gridster.cellWidth;
            this.updateElemenetPosition();
        } else {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
        }
    }
}
