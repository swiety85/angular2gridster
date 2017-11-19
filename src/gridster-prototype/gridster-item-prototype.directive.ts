import { Directive, ElementRef, Input, Output, HostBinding, EventEmitter, OnInit, OnDestroy,
    NgZone} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

import { GridsterPrototypeService } from './gridster-prototype.service';
import { GridListItem } from '../gridList/GridListItem';
import { GridsterService } from '../gridster.service';
import { DraggableEvent } from '../utils/DraggableEvent';
import { Draggable } from '../utils/draggable';
import { utils } from '../utils/utils';

@Directive({
    selector: '[gridsterItemPrototype]'
})
export class GridsterItemPrototypeDirective implements OnInit, OnDestroy {
    @Output() drop = new EventEmitter();
    @Output() start = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() enter = new EventEmitter();
    @Output() out = new EventEmitter();

    @Input() data: any;
    @Input() config: any = {};

    public x = 0;
    public y = 0;
    @Input() w: number;
    @Input() h: number;

    positionX: number;
    positionY: number;

    autoSize = false;

    $element: HTMLElement;

    /**
     * Mouse drag observable
     */
    drag: Observable<any>;

    /**
     * Subscribtion for drag observable
     */
    dragSubscription: ISubscription;

    isDragging = false;

    item: GridListItem;

    containerRectange: ClientRect;

    private parentRect: ClientRect;
    private parentOffset: {left: number, top: number};

    private subscribtions: Array<Subscription> = [];

    // must be set to true because of item dragAndDrop configuration
    get dragAndDrop() {
        return true;
    }

    constructor(private zone: NgZone,
                private elementRef: ElementRef,
                private gridsterPrototype: GridsterPrototypeService) {

        this.item = (new GridListItem()).setFromGridsterItemPrototype(this);
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.enableDragDrop();
        });
    }

    ngOnDestroy() {
        this.subscribtions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }

    public onDrop (gridster: GridsterService): void {
        if (!this.config.helper) {
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

    public getPositionToGridster(gridster: GridsterService) {
        const relativeContainerCoords = this.getContainerCoordsToGridster(gridster);

        return {
            y: this.positionY - relativeContainerCoords.top,
            x: this.positionX - relativeContainerCoords.left
        };
    }

    private getContainerCoordsToGridster(gridster: GridsterService): {top: number, left: number} {
        return {
            left: gridster.gridsterRect.left - this.parentRect.left,
            top: gridster.gridsterRect.top - this.parentRect.top
        };
    }

    private enableDragDrop() {
        let cursorToElementPosition;
        const draggable = new Draggable(this.elementRef.nativeElement);

        const dragStartSub = draggable.dragStart
            .subscribe((event: DraggableEvent) => {
                this.zone.run(() => {
                    this.$element = this.provideDragElement();
                    this.containerRectange = this.$element.parentElement.getBoundingClientRect();
                    this.updateParentElementData();
                    this.onStart(event);

                    cursorToElementPosition = event.getRelativeCoordinates(this.$element);
                });
            });

        const dragSub = draggable.dragMove
            .subscribe((event: DraggableEvent) => {

                this.setElementPosition(this.$element, {
                    x: event.clientX - cursorToElementPosition.x  - this.parentRect.left,
                    y: event.clientY - cursorToElementPosition.y  - this.parentRect.top
                });

                this.onDrag(event);
            });

        const dragStopSub = draggable.dragStop
            .subscribe((event: DraggableEvent) => {
                this.zone.run(() => {
                    this.onStop(event);
                    this.$element = null;
                });
            });

        const scrollSub = Observable.fromEvent(document, 'scroll')
            .subscribe(() => {
                if (this.$element) {
                    this.updateParentElementData();
                }
            });

        this.subscribtions = this.subscribtions.concat([dragStartSub, dragSub, dragStopSub, scrollSub]);
    }

    private setElementPosition(element: HTMLElement, position: {x: number, y: number}) {
        this.positionX = position.x;
        this.positionY = position.y;
        utils.setCssElementPosition(element, position);
    }

    private updateParentElementData() {
        this.parentRect = this.$element.parentElement.getBoundingClientRect();
        this.parentOffset = {
            left: this.$element.parentElement.offsetLeft,
            top: this.$element.parentElement.offsetTop
        };
    }

    private onStart (event: DraggableEvent): void {
        this.isDragging = true;

        this.$element.style.pointerEvents = 'none';
        this.$element.style.position = 'absolute';

        this.gridsterPrototype.dragItemStart(this, event);

        this.start.emit({item: this.item});
    }

    private onDrag (event: DraggableEvent): void {
        this.gridsterPrototype.updatePrototypePosition(this, event);
    }

    private onStop (event: DraggableEvent): void {
        this.gridsterPrototype.dragItemStop(this, event);

        this.isDragging = false;
        this.$element.style.pointerEvents = 'auto';
        this.$element.style.position = '';
        utils.resetCSSElementPosition(this.$element);

        if (this.config.helper) {
            this.$element.parentNode.removeChild(this.$element);
        }
    }

    private provideDragElement (): HTMLElement {
        let dragElement = this.elementRef.nativeElement;

        if (this.config.helper) {
            dragElement = <any>(dragElement).cloneNode(true);

            document.body.appendChild(this.fixStylesForBodyHelper(dragElement));
        } else {
            this.fixStylesForRelativeElement(dragElement);
        }

        return dragElement;
    }

    private fixStylesForRelativeElement(el: HTMLElement) {
        if (window.getComputedStyle(el).position === 'absolute') {
            return el;
        }
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        this.containerRectange = el.parentElement.getBoundingClientRect();

        el.style.position = 'absolute';
        this.setElementPosition(el, {
            x: rect.left - this.containerRectange.left,
            y: rect.top - this.containerRectange.top
        });

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
        this.setElementPosition(el, {
            x: rect.left - bodyRect.left,
            y: rect.top - bodyRect.top
        });

        return el;
    }

}
