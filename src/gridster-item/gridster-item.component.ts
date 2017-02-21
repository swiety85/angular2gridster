import { Component, OnInit, ElementRef, Inject, Host, Input, Output, EventEmitter, SimpleChange, OnChanges, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ISubscription, Subscription } from 'rxjs/Subscription';

import { GridsterService } from '../gridster.service';

@Component({
    selector: 'gridster-item',
    templateUrl: './gridster-item.component.html',
    styleUrls: ['./gridster-item.component.css']
})
export class GridsterItemComponent implements OnInit, OnChanges {
    @Input() x: number;
    @Output() xChange = new EventEmitter<number>();
    @Input() y: number;
    @Output() yChange = new EventEmitter<number>();
    @Input() w: number;
    @Input() h: number;
    //@Input() pin: boolean = false;

    @HostBinding('class.is-dragging') isDragging: boolean = false;

    $element:HTMLElement;
    /**
     * Mouse drag observable
     */
    dragging:Observable<any>;
    /**
     * Gridster provider service
     */
    gridster:GridsterService;
    /**
     * Subscribtion for drag observable
     */
    dragSubscription:ISubscription;

    autoSize: boolean;

    constructor(@Inject(ElementRef) elementRef:ElementRef, @Host() gridster:GridsterService) {
        this.gridster = gridster;

        this.$element = elementRef.nativeElement;
    }

    ngOnInit() {
        this.gridster.registerItem(this);

        if(this.gridster.options.dragAndDrop) {
            this.createMouseDrag(this.$element);
            this.createTouchDrag(this.$element);

            // Update position
            this.dragSubscription = this.dragging.subscribe((pos) => {
                //if(!this.pin){
                this.$element.style.top = (pos.top - this.gridster.$element.offsetTop) + 'px';
                this.$element.style.left = (pos.left - this.gridster.$element.offsetLeft) + 'px';
                //}
            });
        }
    }

    ngOnChanges() {
        if(!this.gridster.gridList) {
            return ;
        }

        this.gridster.gridList.resolveCollisions(this);
        this.gridster.render();
    }

    ngOnDestroy() {
        let index = this.gridster.items.findIndex((z) => z == this);
        if(index){
            this.gridster.items.splice(index,1);
        }
        this.dragSubscription.unsubscribe();
    }

    /**
     * Checks if between target and container exists element with given class
     * @param target
     * @param container
     * @returns {boolean}
     */
    private hasElementWithClass(className:string, target:Element, container:HTMLElement) {
        while(target !== container) {
            if(target.classList
                    .contains(this.gridster.draggableOptions.handlerClass)) {
                return true;
            }
            target = target.parentElement;
        }
        return false;
    }

    /**
     * Create and subscribe to drag event.
     * @param {HTMLElement} dragTarget
     */
    private createMouseDrag(dragTarget:HTMLElement) {
        // Get the three major events
        var mouseup = Observable.fromEvent(dragTarget, 'mouseup'),
            mousemove = Observable.fromEvent(document, 'mousemove'),
            winScroll = Observable.fromEvent(document, 'scroll'),
            mousedown = Observable.fromEvent(dragTarget, 'mousedown');

        this.dragging = mousedown.flatMap((md:MouseEvent) => {
            var drag,
                coordinates = this.getRelativeCoordinates({pageX: md.pageX, pageY: md.pageY}, dragTarget),
                hasHandler = this.hasElementWithClass(
                    this.gridster.draggableOptions.handlerClass,
                    <Element>md.target,
                    dragTarget
                ),
                containerCoordincates = this.gridster.$element.getBoundingClientRect();

            if((this.gridster.draggableOptions.handlerClass && !hasHandler)/*) || this.pin*/) {
                return Observable.of(false);
            }

            this.gridster.onStart(this);
            this.isDragging = true;

            // update container position on window scroll
            winScroll
                .subscribe(() => {
                    containerCoordincates = this.gridster.$element.getBoundingClientRect();
                });

            // Calculate delta with mousemove until mouseup
            drag = mousemove.map((mm:MouseEvent) => {
                mm.preventDefault();

                this.gridster.onDrag(this);

                return {
                    left: mm.clientX - containerCoordincates.left - coordinates.x,
                    top: mm.clientY - containerCoordincates.top - coordinates.y
                };
            }).takeUntil(mouseup);

            drag.subscribe(null, null, () => {
                this.gridster.onStop(this);
                this.isDragging = false;
            });

            return drag;
        });
    }

    // TODO: provide differnt behaviour for touch
    private createTouchDrag(dragTarget:HTMLElement) {
        // Get the three major events
        var touchstart = Observable.fromEvent(dragTarget, 'touchstart'),
            touchmove = Observable.fromEvent(document, 'touchmove'),
            touchend = Observable.merge(
                Observable.fromEvent(dragTarget, 'touchend'),
                Observable.fromEvent(dragTarget, 'touchcancel')
            ),
            touchhold = touchstart.flatMap(function (e:TouchEvent) {
                e.preventDefault();

                return Observable
                    .of(e)
                    .delay(500) // hold press delay
                    .map((data) => {
                        return data;
                    })
                    .takeUntil(Observable.merge(touchend, touchmove));
            });

        this.dragging = Observable.merge(this.dragging, touchstart.flatMap((td:TouchEvent) => {
            var drag,
                touchData = td.touches[0],
                coordinates = this.getRelativeCoordinates({pageX: touchData.pageX, pageY: touchData.pageY}, dragTarget),
                startX = coordinates.x,
                startY = coordinates.y,
                hasHandler = this.hasElementWithClass(
                    this.gridster.draggableOptions.handlerClass,
                    <Element>td.target,
                    dragTarget
                ),
                containerCoordincates = this.gridster.$element.getBoundingClientRect();

            if((this.gridster.draggableOptions.handlerClass && !hasHandler)/* || this.pin */) {
                return Observable.of(false);
            }

            this.gridster.onStart(this);
            this.isDragging = true;

            // Calculate delta with mousemove until mouseup
            drag = touchmove.map((tm:TouchEvent) => {
                let touchMoveData = tm.touches[0];
                tm.preventDefault();

                this.gridster.onDrag(this);

                return {
                    left: touchMoveData.clientX - containerCoordincates.left - startX,
                    top: touchMoveData.clientY - containerCoordincates.top - startY
                };
            }).takeUntil(touchend);

            drag.subscribe(null, null, () => {
                this.gridster.onStop(this);
                this.isDragging = false;
            });

            return drag;
        }));
    }
    /**
     * Get coordinates of cursor relative to given container
     * @param {{pageX,pageY}} e
     * @param {HtmlElement} container
     * @return {{x: number, y: number}}
     */
    private getRelativeCoordinates(e:{pageX:number,pageY:number}, container:HTMLElement) {
        var offset,
            ref;

        offset = {left: 0, top: 0};
        ref = container.offsetParent;

        offset.left = container.offsetLeft;
        offset.top = container.offsetTop;

        while (ref) {
            offset.left += ref.offsetLeft;
            offset.top += ref.offsetTop;

            ref = ref.offsetParent;
        }

        return {
            x: e.pageX - offset.left,
            y: e.pageY - offset.top,
        };
    }

    /**
     * Serialize GridsterItemComponent to object literal with key properties
     * @returns {{$element: HTMLElement, x: number, y: number, w: number, h: number, autoSize: boolean}}
     */
    public serialize () {
        return {
            $element: this.$element,
            x: this.x, y: this.y,
            w: this.w, h: this.h,
            autoSize: this.autoSize
        };
    }

}




