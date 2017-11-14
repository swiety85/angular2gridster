import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/filter';

import { GridsterService } from '../gridster.service';
import { GridsterItemPrototypeDirective } from './gridster-item-prototype.directive';
import { utils } from '../utils/utils';
import {DraggableEvent} from '../utils/DraggableEvent';

@Injectable()
export class GridsterPrototypeService {

    private isDragging = false;

    private dragSubject = new Subject<any>();

    private dragStartSubject = new Subject<any>();

    private dragStopSubject = new Subject<any>();

    constructor() {}

    observeDropOver (gridster: GridsterService) {
        return this.dragStopSubject.asObservable()
            .filter((data) => {
                return this.isOverGridster(data.item, gridster, data.event);
            })
            .do((prototype: GridsterItemPrototypeDirective) => {
                // TODO: what we should provide as a param?
                // prototype.drop.emit({item: prototype.item});
                prototype.onDrop(gridster);
            });
    }

    observeDropOut (gridster: GridsterService) {
        return this.dragStopSubject.asObservable()
            .filter((data) => {
                return !this.isOverGridster(data.item, gridster, data.event);
            })
            .do((data) => {
                // TODO: what we should provide as a param?
                data.item.onCancel();
            });
    }

    observeDragOver(gridster: GridsterService): {
        dragOver: Observable<GridsterItemPrototypeDirective>,
        dragEnter: Observable<GridsterItemPrototypeDirective>,
        dragOut: Observable<GridsterItemPrototypeDirective>
    } {
        const over = this.dragSubject.asObservable()
            .map((data) => {
                return {
                    item: data.item,
                    event: data.event,
                    isOver: this.isOverGridster(data.item, gridster, data.event),
                    isDrop: false
                };
            });

        const drop = this.dragStopSubject.asObservable()
            .map((data) => {
                return {
                    item: data.item,
                    event: data.event,
                    isOver: this.isOverGridster(data.item, gridster, data.event),
                    isDrop: true
                };
            });

        const dragExt = Observable.merge(
                // dragStartSubject is connected in case when item prototype is placed above gridster
                // and drag enter is not fired
                this.dragStartSubject.map(() => ({ item: null, isOver: false, isDrop: false })),
                over,
                drop
            )
            .scan((prev: any, next: any) => {

                return {
                    item: next.item,
                    event: next.event,
                    isOver: next.isOver,
                    isEnter: prev.isOver === false && next.isOver === true,
                    isOut: prev.isOver === true && next.isOver === false && !prev.isDrop,
                    isDrop: next.isDrop
                };
            })
            .filter((data: any) => {
                return !data.isDrop;
            });

        const dragEnter = this.createDragEnterObservable(dragExt, gridster);
        const dragOut = this.createDragOutObservable(dragExt, gridster);
        const dragOver = dragEnter.switchMap(() => {
                return this.dragSubject.asObservable()
                    .takeUntil(dragOut);
            })
            .map(data => data.item);

        return { dragEnter, dragOut, dragOver };
    }

    dragItemStart(item: GridsterItemPrototypeDirective, event: DraggableEvent) {
        this.isDragging = true;
        this.dragStartSubject.next({ item, event });
    }

    dragItemStop(item: GridsterItemPrototypeDirective, event: DraggableEvent) {
        this.isDragging = false;
        this.dragStopSubject.next({ item, event });
    }

    updatePrototypePosition(item: GridsterItemPrototypeDirective, event: DraggableEvent) {
        this.dragSubject.next({ item, event });
    }

    /**
     * Creates observable that is fired on dragging over gridster container.
     * @param dragIsOver Observable that returns information true/false whether prototype item
     * is over gridster container
     * @returns {Observable}
     */
    private createDragOverObservable (
        dragIsOver: Observable<{item: GridsterItemPrototypeDirective, isOver: boolean}>,
        gridster: GridsterService
    ) {
        return dragIsOver
            .filter((data: any) => {
                return data.isOver && !data.isEnter && !data.isOut;
            })
            .map((data: any): GridsterItemPrototypeDirective => {
                return data.item;
            })
            .do((item) => {
                item.onOver(gridster);
            });
    }
    /**
     * Creates observable that is fired on drag enter gridster container.
     * @param dragIsOver Observable that returns information true/false whether prototype item
     * is over gridster container
     * @returns {Observable}
     */
    private createDragEnterObservable (
        dragIsOver: Observable<{item: GridsterItemPrototypeDirective, isOver: boolean}>,
        gridster: GridsterService
    ) {
        return dragIsOver
            .filter((data: any) => {
                return data.isEnter;
            })
            .map((data: any): GridsterItemPrototypeDirective => {
                return data.item;
            })
            .do((item) => {
                item.onEnter(gridster);
            });
    }
    /**
     * Creates observable that is fired on drag out gridster container.
     * @param dragIsOver Observable that returns information true/false whether prototype item
     * is over gridster container
     * @returns {Observable}
     */
    private createDragOutObservable (
        dragIsOver: Observable<{item: GridsterItemPrototypeDirective,
        isOver: boolean}>,
        gridster: GridsterService
    ) {
        return dragIsOver
            .filter((data: any) => {
                return data.isOut;
            })
            .map((data: any): GridsterItemPrototypeDirective => {
                return data.item;
            })
            .do((item) => {
                item.onOut(gridster);
            });
    }

    /**
     * Checks whether "element" position fits inside "containerEl" position.
     * It checks if "element" is totally covered by "containerEl" area.
     * @param element Dragged element
     * @param containerEl Element above which "element" is dragged
     * @param event DraggableEvent
     * @returns {boolean}
     */
    private isOverGridster(item: GridsterItemPrototypeDirective, gridster: GridsterService, event): boolean {
        const el = item.$element;
        const elContainer = gridster.gridsterComponent.$element;
        const tolerance = gridster.options.tolerance;

        if (tolerance === 'fit') {
            return utils.isElementFitContainer(el, elContainer);
        }
        if (tolerance === 'intersect') {
            return utils.isElementIntersectContainer(el, elContainer);
        }
        if (tolerance === 'touch') {
            return utils.isElementTouchContainer(el, elContainer);
        }

        return utils.isCursorAboveElement(event, elContainer);
    }
}
