import { Component, OnInit, ElementRef, Inject, Host, Input, Output,
    EventEmitter, SimpleChange, OnChanges, HostBinding, HostListener,
    ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ISubscription, Subscription } from 'rxjs/Subscription';

import { GridsterService } from '../gridster.service';
import { GridListItem } from '../gridList/GridListItem';
import { dragdrop } from '../utils/dragdrop';

@Component({
    selector: 'gridster-item',
    templateUrl: './gridster-item.component.html',
    styleUrls: ['./gridster-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridsterItemComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() x: number;
    @Output() xChange = new EventEmitter<number>();
    @Input() y: number;
    @Output() yChange = new EventEmitter<number>();
    @Input() w: number;
    @Input() h: number;

    autoSize: boolean;

    @HostBinding('class.is-dragging') isDragging: boolean = false;

    $element: HTMLElement;
    /**
     * Mouse drag observable
     */
    //dragging: Observable<any>;
    /**
     * Gridster provider service
     */
    gridster: GridsterService;
    /**
     * Subscribtion for drag observable
     */
    //dragSubscription: ISubscription;

    item: GridListItem;



    private subscribtions: Array<Subscription> = [];

    constructor(private cdr: ChangeDetectorRef, @Inject(ElementRef) elementRef:ElementRef, @Host() gridster:GridsterService) {
        this.gridster = gridster;

        this.$element = elementRef.nativeElement;

        this.item = (new GridListItem()).setFromGridsterItem(this);

        //if gridster is initialized do not show animation on new grid-item construct
        if(this.gridster.$element) {
            this.preventAnimation();
        }
    }

    ngAfterViewInit() {
        this.cdr.detach();
    }

    ngOnInit() {
        this.gridster.registerItem(this.item);
        // only if new item is registered after bootstrap
        if(this.gridster.$element) {

            this.gridster.gridList.resolveCollisions(this.item);
            this.gridster.reflow();
        }

        if(this.gridster.options.dragAndDrop) {
            this.enableDragDrop();
            //this.createMouseDrag(this.$element);
            //this.createTouchDrag(this.$element);
            //
            //// Update position
            //this.dragSubscription = this.dragging.subscribe((pos) => {
            //    this.$element.style.top = (pos.top - this.gridster.$element.top) + 'px';
            //    this.$element.style.left = (pos.left - this.gridster.$element.left) + 'px';
            //});
        }
    }

    ngOnChanges() {
        if(!this.gridster.gridList) {
            return ;
        }

        this.gridster.gridList.resolveCollisions(this.item);
        this.gridster.render();
    }

    ngOnDestroy() {
        let index = this.gridster.items.indexOf(this.item);
        if(index >= 0){
            this.gridster.items.splice(index,1);
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
                this.$element.style.top = (position.top - this.gridster.gridsterOffset.top  - this.gridster.gridsterRect.top) + 'px';
                this.$element.style.left = (position.left - this.gridster.gridsterOffset.left  - this.gridster.gridsterRect.left) + 'px';

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

    /**
     * Checks if between target and container exists element with given class
     * @param target
     * @param container
     * @returns {boolean}
     */
    //private hasElementWithClass(className:string, target:Element, container:HTMLElement) {
    //    while(target !== container) {
    //        if(target.classList
    //                .contains(this.gridster.draggableOptions.handlerClass)) {
    //            return true;
    //        }
    //        target = target.parentElement;
    //    }
    //    return false;
    //}

    /**
     * Create and subscribe to drag event.
     * @param {HTMLElement} dragTarget
     */
    //private createMouseDrag(dragTarget:HTMLElement) {
    //    // Get the three major events
    //    var mouseup = Observable.fromEvent(dragTarget, 'mouseup'),
    //        mousemove = Observable.fromEvent(document, 'mousemove'),
    //        winScroll = Observable.fromEvent(document, 'scroll'),
    //        mousedown = Observable.fromEvent(dragTarget, 'mousedown');
    //
    //    this.dragging = mousedown.flatMap((md:MouseEvent) => {
    //        var drag,
    //            coordinates = this.getRelativeCoordinates({pageX: md.pageX, pageY: md.pageY}, dragTarget),
    //            hasHandler = this.hasElementWithClass(
    //                this.gridster.draggableOptions.handlerClass,
    //                <Element>md.target,
    //                dragTarget
    //            ),
    //            containerCoordincates = this.gridster.$element.getBoundingClientRect();
    //
    //        if((this.gridster.draggableOptions.handlerClass && !hasHandler)/*) || this.pin*/) {
    //            return Observable.of(false);
    //        }
    //
    //        this.gridster.onStart(this.item);
    //        this.isDragging = true;
    //
    //        // update container position on window scroll
    //        winScroll
    //            .subscribe(() => {
    //                containerCoordincates = this.gridster.$element.getBoundingClientRect();
    //            });
    //
    //        // Calculate delta with mousemove until mouseup
    //        drag = mousemove.map((mm:MouseEvent) => {
    //            mm.preventDefault();
    //
    //            this.gridster.onDrag(this.item);
    //
    //            return {
    //                left: mm.clientX - containerCoordincates.left - coordinates.x,
    //                top: mm.clientY - containerCoordincates.top - coordinates.y
    //            };
    //        }).takeUntil(mouseup);
    //
    //        drag.subscribe(null, null, () => {
    //            this.gridster.onStop(this.item);
    //            this.isDragging = false;
    //        });
    //
    //        return drag;
    //    });
    //}

    // TODO: provide differnt behaviour for touch
    //private createTouchDrag(dragTarget:HTMLElement) {
    //    // Get the three major events
    //    var touchstart = Observable.fromEvent(dragTarget, 'touchstart'),
    //        touchmove = Observable.fromEvent(document, 'touchmove'),
    //        touchend = Observable.merge(
    //            Observable.fromEvent(dragTarget, 'touchend'),
    //            Observable.fromEvent(dragTarget, 'touchcancel')
    //        ),
    //        touchhold = touchstart.flatMap(function (e:TouchEvent) {
    //            e.preventDefault();
    //
    //            return Observable
    //                .of(e)
    //                .delay(500) // hold press delay
    //                .map((data) => {
    //                    return data;
    //                })
    //                .takeUntil(Observable.merge(touchend, touchmove));
    //        });
    //
    //    this.dragging = Observable.merge(this.dragging, touchstart.flatMap((td:TouchEvent) => {
    //        var drag,
    //            touchData = td.touches[0],
    //            coordinates = this.getRelativeCoordinates({pageX: touchData.pageX, pageY: touchData.pageY}, dragTarget),
    //            startX = coordinates.x,
    //            startY = coordinates.y,
    //            hasHandler = this.hasElementWithClass(
    //                this.gridster.draggableOptions.handlerClass,
    //                <Element>td.target,
    //                dragTarget
    //            ),
    //            containerCoordincates = this.gridster.$element.getBoundingClientRect();
    //
    //        if((this.gridster.draggableOptions.handlerClass && !hasHandler)/* || this.pin */) {
    //            return Observable.of(false);
    //        }
    //
    //        this.gridster.onStart(this.item);
    //        this.isDragging = true;
    //
    //        // Calculate delta with mousemove until mouseup
    //        drag = touchmove.map((tm:TouchEvent) => {
    //            let touchMoveData = tm.touches[0];
    //            tm.preventDefault();
    //
    //            this.gridster.onDrag(this.item);
    //
    //            return {
    //                left: touchMoveData.clientX - containerCoordincates.left - startX,
    //                top: touchMoveData.clientY - containerCoordincates.top - startY
    //            };
    //        }).takeUntil(touchend);
    //
    //        drag.subscribe(null, null, () => {
    //            this.gridster.onStop(this.item);
    //            this.isDragging = false;
    //            this.xChange.emit(this.x);
    //            this.yChange.emit(this.y);
    //        });
    //
    //        return drag;
    //    }));
    //}
    /**
     * Get coordinates of cursor relative to given container
     * @param {{pageX,pageY}} e
     * @param {HtmlElement} container
     * @return {{x: number, y: number}}
     */
//    private getRelativeCoordinates(e:{pageX:number,pageY:number}, container:HTMLElement) {
//        var offset,
//            ref;
//
//        offset = {left: 0, top: 0};
//        ref = container.offsetParent;
//
//        offset.left = container.left;
//        offset.top = container.top;
//
//        while (ref) {
//            offset.left += ref.left;
//            offset.top += ref.top;
//
//            ref = ref.offsetParent;
//        }
//
//        return {
//            x: e.pageX - offset.left,
//            y: e.pageY - offset.top,
//        };
//    }
}
