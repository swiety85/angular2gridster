import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';

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

    observeDragOver(gridster: GridsterService): Observable<GridsterItemPrototypeDirective> {
        const dragOver = this.dragObservable
            .filter((item: GridsterItemPrototypeDirective) => {
                return this.isInsideContainer(item.$element, gridster.$element);
            });

        return dragOver;
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

    private isInsideContainer(element, containerEl) {
        const containerRect = containerEl.getBoundingClientRect();
        const elRect = element.getBoundingClientRect();

        return elRect.left > containerRect.left &&
            elRect.right < containerRect.right &&
            elRect.top > containerRect.top &&
            elRect.bottom < containerRect.bottom;
    }




    //getDragOverObservable2 (gridster: GridsterService): Observable<GridsterItemPrototypeDirective> {
    //    const mouseEnter = Observable.fromEvent(gridster.$element, 'mouseenter');
    //    const mouseLeave = Observable.fromEvent(gridster.$element, 'mouseleave');
    //    const dragOver = this.dragStartObservable.mergeMap(() => {
    //        return mouseEnter.mergeMap(() => {
    //            return this.dragObservable
    //                .takeUntil(mouseLeave);
    //        }).takeUntil(this.dragStopObservable);
    //    });
    //
    //    //dragOver.subscribe(() => {
    //    //    console.log('drag over');
    //    //});
    //
    //    return dragOver;
    //}
}
