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
import { GridListItem } from '../gridList/GridListItem';

@Injectable()
export class GridsterPrototypeService {

    private isDragging = false;

    private dragSubject = new Subject<GridsterItemPrototypeDirective>();

    private dragStartSubject = new Subject<GridsterItemPrototypeDirective>();

    private dragStopSubject = new Subject<GridsterItemPrototypeDirective>();

    constructor() {}

    observeDropOver (gridster: GridsterService) {
        return this.dragStopSubject.asObservable()
            .filter((item: GridsterItemPrototypeDirective) => {
                return this.isInsideContainer(item.$element, gridster.gridsterComponent.$element);
            })
            .do((prototype: GridsterItemPrototypeDirective) => {
                // TODO: what we should provide as a param?
                // prototype.drop.emit({item: prototype.item});
                prototype.onDrop(gridster);
            });
    }

    observeDropOut (gridster: GridsterService) {
        return this.dragStopSubject.asObservable()
            .filter((item: GridsterItemPrototypeDirective) => {
                return !this.isInsideContainer(item.$element, gridster.gridsterComponent.$element);
            })
            .do((prototype: GridsterItemPrototypeDirective) => {
                // TODO: what we should provide as a param?
                prototype.onCancel();
            });
    }

    observeDragOver(gridster: GridsterService): {
        dragOver: Observable<GridsterItemPrototypeDirective>,
        dragEnter: Observable<GridsterItemPrototypeDirective>,
        dragOut: Observable<GridsterItemPrototypeDirective>
    } {
        const over = this.dragSubject.asObservable()
            .map((item: GridsterItemPrototypeDirective) => {
                return {
                    item,
                    isOver: this.isInsideContainer(item.$element, gridster.gridsterComponent.$element),
                    isDrop: false
                };
            });

        const drop = this.dragStopSubject.asObservable()
            .map((item: GridsterItemPrototypeDirective) => {
                return {
                    item,
                    isOver: this.isInsideContainer(item.$element, gridster.gridsterComponent.$element),
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
        });

        return { dragEnter, dragOut, dragOver };
    }

    dragItemStart(item: GridsterItemPrototypeDirective) {
        this.isDragging = true;
        this.dragStartSubject.next(item);
    }

    dragItemStop(item: GridsterItemPrototypeDirective) {
        this.isDragging = false;
        this.dragStopSubject.next(item);
    }

    updatePrototypePosition(item: GridsterItemPrototypeDirective) {
        this.dragSubject.next(item);
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
     * @returns {boolean}
     */
    private isInsideContainer(element, containerEl) {
        const containerRect = containerEl.getBoundingClientRect();
        const elRect = element.getBoundingClientRect();

        return elRect.left > containerRect.left &&
            elRect.right < containerRect.right &&
            elRect.top > containerRect.top &&
            elRect.bottom < containerRect.bottom;
    }
}
