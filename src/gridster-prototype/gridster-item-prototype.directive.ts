import { Directive, ElementRef, Input, Output, HostBinding, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import "rxjs/add/observable/of";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

import { GridsterPrototypeService } from './gridster-prototype.service';

@Directive({
    selector: '[gridsterItemPrototype]'
})
export class GridsterItemPrototypeDirective {

    @HostBinding('style.pointer-events') pointerEvents = 'auto';

    @Input() data: any;

    public x: number = 0;
    @Output() xChange = new EventEmitter<number>();
    public y: number = 0;
    @Output() yChange = new EventEmitter<number>();
    @Input() w: number;
    @Input() h: number;

    $element: HTMLElement;

    /**
     * Mouse drag observable
     */
    drag:Observable<any>;

    /**
     * Subscribtion for drag observable
     */
    dragSubscription:ISubscription;

    isDragging: boolean = false;

    constructor(elementRef:ElementRef, private gridsterPrototype: GridsterPrototypeService) {
        this.$element = elementRef.nativeElement;
    }

    ngOnInit() {
        this.createMouseDrag(this.$element);

        // Update position
        this.dragSubscription = this.drag.subscribe((pos) => {
            this.$element.style.top = pos.top + 'px';
            this.$element.style.left = pos.left + 'px';

            this.gridsterPrototype.updatePrototypePosition(this);
        });
    }

    /**
     * Create and subscribe to drag event.
     * @param {HTMLElement} dragTarget
     */
    private createMouseDrag(dragTarget:HTMLElement) {
        // Get the three major events
        const mouseup = Observable.fromEvent(document, 'mouseup');
        const mousemove = Observable.fromEvent(document, 'mousemove');
        const mousedown = Observable.fromEvent(dragTarget, 'mousedown');

        this.drag = mousedown.mergeMap((md:MouseEvent) => {
            const coordinates = this.getRelativeCoordinates({pageX: md.pageX, pageY: md.pageY}, dragTarget);
            const containerCoordincates = { left: 0, top: 0 };

            md.preventDefault();

            this.isDragging = true;
            this.pointerEvents = 'none';
            //this.gridster.onStart(this);
            this.gridsterPrototype.dragItemStart(this);

            // Calculate delta with mousemove until mouseup
            let drag = mousemove.map((mm:MouseEvent) => {
                //mm.preventDefault();

                //this.gridster.onDrag(this);

                return {
                    left: mm.clientX - containerCoordincates.left - coordinates.x,
                    top: mm.clientY - containerCoordincates.top - coordinates.y
                };
            }).takeUntil(mouseup);

            drag.subscribe(null, (err) => {
                console.error('Drag failed:', err);
            }, () => {
                //this.gridster.onStop(this);
                this.pointerEvents = 'auto';
                this.gridsterPrototype.dragItemStop(this);
                this.isDragging = false;
            });

            return drag;
        });
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

}
