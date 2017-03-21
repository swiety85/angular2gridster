import { Component, OnInit, ElementRef, Inject, Host, Input, Output,
    EventEmitter, SimpleChange, OnChanges, OnDestroy, HostBinding, HostListener,
    ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ISubscription, Subscription } from 'rxjs/Subscription';

import { GridsterService } from '../gridster.service';
import { GridListItem } from '../gridList/GridListItem';
import { dragdrop } from '../utils/dragdrop';

@Component({
    selector: 'gridster-item',
    template: `<div class="gridster-item-inner">
      <ng-content></ng-content>
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

    :host.is-dragging {
        -webkit-transition: none;
        transition: none;
        z-index: 9999;
    }

    :host.no-transition {
        -webkit-transition: none;
        transition: none;
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
    @Input() h: number;

    autoSize: boolean;

    @HostBinding('class.is-dragging') isDragging = false;

    $element: HTMLElement;
    /**
     * Mouse drag observable
     */
    // dragging: Observable<any>;
    /**
     * Gridster provider service
     */
    gridster: GridsterService;

    item: GridListItem;

    private subscribtions: Array<Subscription> = [];

    constructor(
        private cdr: ChangeDetectorRef,
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
            return ;
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

        this.subscribtions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }

    private enableDragDrop() {
        const dragAPI = dragdrop(this.$element, {
            handlerClass: this.gridster.draggableOptions.handlerClass
        });

        const dragStartSub = dragAPI.observeDragStart()
            .subscribe(() => {
                this.gridster.onStart(this.item);
                this.isDragging = true;
            });

        const dragSub = dragAPI.observeDrag()
            .subscribe((position) => {
                this.$element.style.top = (
                    position.top - this.gridster.gridsterOffset.top  - this.gridster.gridsterRect.top
                    ) + 'px';
                this.$element.style.left = (
                    position.left - this.gridster.gridsterOffset.left  - this.gridster.gridsterRect.left
                    ) + 'px';

                this.gridster.onDrag(this.item);
            });

        const dragStopSub = dragAPI.observeDrop()
            .subscribe(() => {
                this.gridster.onStop(this.item);
                this.isDragging = false;
            });

        this.subscribtions = this.subscribtions.concat([dragStartSub, dragSub, dragStopSub]);
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
}
