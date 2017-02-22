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
import {GridsterItemPrototypeDirective} from "./gridster-item-prototype.directive";

@Injectable()
export class GridsterPrototypeService {

    private isDragging: boolean = false;

    private dragSubject = new Subject<GridsterItemPrototypeDirective>();
    public dragObservable: Observable<GridsterItemPrototypeDirective> = this.dragSubject.asObservable();

    private dragStartSubject = new Subject<GridsterItemPrototypeDirective>();
    public dragStartObservable: Observable<GridsterItemPrototypeDirective> = this.dragStartSubject.asObservable();

    private dragStopSubject = new Subject<GridsterItemPrototypeDirective>();
    public dragStopObservable: Observable<GridsterItemPrototypeDirective> = this.dragStopSubject.asObservable();

    constructor() {}

    observeDragOver(gridster: GridsterService): {
        dragOver: Observable<GridsterItemPrototypeDirective>,
        dragEnter: Observable<GridsterItemPrototypeDirective>,
        dragOut: Observable<GridsterItemPrototypeDirective>
    } {
        const dragIsOver = this.dragObservable
            .map((item: GridsterItemPrototypeDirective) => {
                return {
                    item,
                    isOver: this.isInsideContainer(item.$element, gridster.$element)
                };
            })
            .scan((prev: any, next: any) => {
                return {
                    item: next.item,
                    isOver: next.isOver,
                    isEnter: prev.isOver === false && next.isOver === true,
                    isOut: prev.isOver === true && next.isOver === false
                };
            });

        return {
            dragOver: this.createDragOverObservable(dragIsOver),
            dragEnter: this.createDragEnterObservable(dragIsOver),
            dragOut: this.createDragOutObservable(dragIsOver)
        };
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
     * @param dragIsOver Observable that returns information true/false whether prototype item is over gridster container
     * @returns {Observable}
     */
    private createDragOverObservable (dragIsOver: Observable<{item: GridsterItemPrototypeDirective, isOver: boolean}>) {
        return dragIsOver
            .filter((data: any) => {
                return data.isOver && !data.isEnter && !data.isOut;
            })
            .map((data: any) => {
                return data.item;
            });
    }
    /**
     * Creates observable that is fired on drag enter gridster container.
     * @param dragIsOver Observable that returns information true/false whether prototype item is over gridster container
     * @returns {Observable}
     */
    private createDragEnterObservable (dragIsOver: Observable<{item: GridsterItemPrototypeDirective, isOver: boolean}>) {
        return dragIsOver
            .filter((data: any) => {
                return data.isEnter;
            })
            .map((data: any) => {
                return data.item;
            });
    }
    /**
     * Creates observable that is fired on drag out gridster container.
     * @param dragIsOver Observable that returns information true/false whether prototype item is over gridster container
     * @returns {Observable}
     */
    private createDragOutObservable (dragIsOver: Observable<{item: GridsterItemPrototypeDirective, isOver: boolean}>) {
        return dragIsOver
            .filter((data: any) => {
                return data.isOut;
            })
            .map((data: any) => {
                return data.item;
            });
    }

    /**
     * Checks wheter "element" position fits inside "containerEl" position.
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
