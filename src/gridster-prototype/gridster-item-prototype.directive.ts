import { Directive, ElementRef, Input, Output, HostBinding, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import "rxjs/add/observable/of";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

import { GridsterPrototypeService } from './gridster-prototype.service';
import {GridListItem} from '../gridList/GridListItem';
import {GridsterService} from '../gridster.service';
import { dragdrop } from '../utils/dragdrop';

@Directive({
    selector: '[gridsterItemPrototype]'
})
export class GridsterItemPrototypeDirective {
    @Output() drop = new EventEmitter();
    @Output() start = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() enter = new EventEmitter();
    @Output() out = new EventEmitter();

    @Input() data: any;
    @Input('gridsterItemPrototype') config: any = {};

    public x: number = 0;
    public y: number = 0;
    @Input() w: number;
    @Input() h: number;

    autoSize: boolean;

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

    item: GridListItem;

    private parentRect: ClientRect;
    private parentOffset: {left: number, top: number};

    private subscribtions: Array<Subscription> = [];

    constructor(private elementRef:ElementRef, private gridsterPrototype: GridsterPrototypeService) {
        this.item = (new GridListItem()).setFromGridsterItemPrototype(this);
    }

    ngOnInit() {
        this.enableDragDrop();
        //this.drag = this.createMouseDrag();
        //this.drag.subscribe();
    }

    ngOnDestroy() {
        this.subscribtions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }

    private enableDragDrop() {
        const dragAPI = dragdrop(this.elementRef.nativeElement);

        const dragStartSub = dragAPI.observeDragStart()
            .subscribe(() => {
                this.$element = this.provideDragElement();
                this.updateParentElementData();
                this.onStart();
            });

        const dragSub = dragAPI.observeDrag(() => {
                return this.$element;
            })
            .subscribe((position) => {
                this.$element.style.top = (position.top  - this.parentRect.top) + 'px';
                this.$element.style.left = (position.left  - this.parentRect.left) + 'px';

                this.onDrag(position);
            });

        const dragStopSub = dragAPI.observeDrop()
            .subscribe(() => {
                this.onStop();
                this.$element = null;
            });

        const scrollSub = Observable.fromEvent(document, 'scroll')
            .subscribe(() => {
                if(this.$element) {
                    this.updateParentElementData()
                }
            });

        this.subscribtions = this.subscribtions.concat([dragStartSub, dragSub, dragStopSub, scrollSub]);
    }

    private updateParentElementData() {
        this.parentRect = this.$element.parentElement.getBoundingClientRect();
        this.parentOffset = {
            left: this.$element.parentElement.offsetLeft,
            top: this.$element.parentElement.offsetTop
        };
    }

    /**
     * Create and subscribe to drag event.
     */
    //private createMouseDrag() {
    //
    //    // Get the three major events
    //    const winScroll = Observable.fromEvent(document, 'scroll');
    //    const mouseup = Observable.fromEvent(document, 'mouseup');
    //    const mousemove = Observable.fromEvent(document, 'mousemove');
    //    const mousedown = Observable.fromEvent(this.elementRef.nativeElement, 'mousedown');
    //
    //    return mousedown.mergeMap((md:MouseEvent) => {
    //        this.$element = this.provideDragElement();
    //
    //        const coordinates = this.getRelativeCoordinates({pageX: md.pageX, pageY: md.pageY}, this.$element);
    //        let containerCoordincates = this.$element.parentElement.getBoundingClientRect();
    //
    //        this.onStart();
    //
    //        md.preventDefault();
    //
    //        // update container position on window scroll
    //        winScroll
    //            .takeUntil(mouseup)
    //            .subscribe(() => {
    //                containerCoordincates = this.$element.parentElement.getBoundingClientRect();
    //            });
    //
    //        // Calculate delta with mousemove until mouseup
    //        const drag = mousemove.map((mm:MouseEvent) => {
    //
    //            return {
    //                left: mm.clientX - containerCoordincates.left - coordinates.x,
    //                top: mm.clientY - containerCoordincates.top - coordinates.y
    //            };
    //        }).takeUntil(mouseup);
    //
    //        drag.subscribe(
    //            (pos) => this.onDrag(pos),
    //            (err) => console.error('Drag failed:', err),
    //            () => {
    //                this.onStop();
    //                this.$element = null;
    //            }
    //        );
    //
    //        return drag;
    //    });
    //}

    public onDrop (gridster: GridsterService): void {
        if(!this.config.helper) {
            this.$element.parentNode.removeChild(this.$element);
        }

        this.drop.emit({
            item: this.item,
            gridster: gridster
        });
    }

    public onCancel (): void {
        this.cancel.emit({item: this.item});
    }

    public onEnter (gridster: GridsterService): void {
        this.enter.emit({
            item: this.item,
            gridster: gridster
        });
    }

    public onOver (gridster: GridsterService): void {}

    public onOut (gridster: GridsterService): void {
        this.out.emit({
            item: this.item,
            gridster: gridster
        });
    }

    private onStart (): void {
        this.isDragging = true;

        this.$element.style.pointerEvents = 'none';
        this.$element.style.position = 'absolute';

        this.gridsterPrototype.dragItemStart(this);

        this.start.emit({item: this.item});
    }

    private onDrag (position: {top: number, left: number}): void {
        //this.$element.style.top = position.top + 'px';
        //this.$element.style.left = position.left + 'px';

        this.gridsterPrototype.updatePrototypePosition(this);
    }
    
    private onStop (): void {
        this.gridsterPrototype.dragItemStop(this);

        this.isDragging = false;
        this.$element.style.pointerEvents = 'auto';
        this.$element.style.position = '';
        this.$element.style.top = '';
        this.$element.style.left = '';

        if(this.config.helper) {
            this.$element.parentNode.removeChild(this.$element);
        }
    }

    private provideDragElement (): HTMLElement {
        let dragElement = this.elementRef.nativeElement;

        if(this.config.helper) {
            dragElement = <any>(dragElement).cloneNode(true);

            document.body.appendChild(this.fixStylesForBodyHelper(dragElement));
        }
        else {
            this.fixStylesForRelativeElement(dragElement);
        }

        return dragElement;
    }

    private fixStylesForRelativeElement(el: HTMLElement) {
        if(window.getComputedStyle(el).position === 'absolute') {
            return el;
        }

        const containerRect = el.parentElement.getBoundingClientRect();
        const rect = this.elementRef.nativeElement.getBoundingClientRect();

        el.style.position = 'absolute';
        el.style.left = (rect.left - containerRect.left)+'px';
        el.style.top = (rect.top - containerRect.top)+'px';

        return el;
    }

    /**
     * When element is cloned and append to body it should have position absolute and coords set by original
     * relative prototype element position.
     * @param el
     * @returns {HTMLElement}
     */
    private fixStylesForBodyHelper (el: HTMLElement) {
        const bodyRect = document.body.getBoundingClientRect();
        const rect = this.elementRef.nativeElement.getBoundingClientRect();

        el.style.position = 'absolute';
        el.style.left = (rect.left - bodyRect.left)+'px';
        el.style.top = (rect.top - bodyRect.top)+'px';

        return el;
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
