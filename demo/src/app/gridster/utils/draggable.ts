import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';

import {DraggableEvent} from './DraggableEvent';

export class Draggable {
    element: Element;

    dragStart: Observable<DraggableEvent>;
    dragMove: Observable<DraggableEvent>;
    dragStop: Observable<DraggableEvent>;

    private mousemove: Observable<Event> = Observable.merge(
        Observable.fromEvent(document, 'mousemove'),
        Observable.fromEvent(document, 'touchmove', {passive: true})
    );

    private mouseup: Observable<Event> = Observable.merge(
        Observable.fromEvent(document, 'mouseup'),
        Observable.fromEvent(document, 'touchend'),
        Observable.fromEvent(document, 'touchcancel')
    );

    private mousedown: Observable<Event>;

    private config = {
        handlerClass: null
    };

    constructor(element: Element, config: {handlerClass?: string} = {}) {
        this.element = element;
        this.mousedown = Observable.merge(
            Observable.fromEvent(element, 'mousedown'),
            Observable.fromEvent(element, 'touchstart')
        );

        this.config.handlerClass = config.handlerClass;

        this.dragStart = this.createDragStartObservable().share();
        this.dragMove = this.createDragMoveObservable(this.dragStart);
        this.dragStop = this.createDragStopObservable(this.dragStart);
    }

    private createDragStartObservable(): Observable<DraggableEvent> {
        return this.mousedown
            .map(md => new DraggableEvent(md))
            .filter((event: DraggableEvent) => this.isDragingByHandler(event))
            .do(e => {
                e.pauseEvent();
                (<any>document.activeElement).blur();
            })
            .switchMap((startEvent: DraggableEvent) => {

                return this.mousemove
                    .map(mm => new DraggableEvent(mm))
                    .filter((moveEvent: DraggableEvent) => this.inRange(startEvent, moveEvent, 5))
                    .map(() => startEvent)
                    .takeUntil(this.mouseup)
                    .take(1);
            });
    }

    private createDragMoveObservable(dragStart: Observable<DraggableEvent>): Observable<DraggableEvent> {
        return dragStart
            .flatMap(() => {
                return this.mousemove
                    .skip(1)
                    .map(mm => new DraggableEvent(mm))
                    .takeUntil(this.mouseup);
            })
            .filter(val => !!val);
    }

    private createDragStopObservable(dragStart: Observable<DraggableEvent>): Observable<any> {
        return dragStart
            .flatMap(() => {
                return this.mousemove
                    .takeUntil(this.mouseup)
                    .last();
            });
    }

    private isDragingByHandler(event: DraggableEvent): boolean {
        if (!this.isValidDragHandler(event.target)) {
            return false;
        }

        return !this.config.handlerClass ||
            (this.config.handlerClass && this.hasElementWithClass(this.config.handlerClass, event.target));
    }

    private isValidDragHandler(targetEl: any): boolean {
        return ['input', 'textarea'].indexOf(targetEl.tagName.toLowerCase()) === -1;
    }

    private inRange(startEvent: DraggableEvent, moveEvent: DraggableEvent, range: number): boolean {
        return Math.abs(moveEvent.clientX - startEvent.clientX) > range ||
            Math.abs(moveEvent.clientY - startEvent.clientY) > range;
    }

    private hasElementWithClass(className: string, target: any): boolean {
        while (target !== this.element) {
            if (target.classList.contains(className)) {
                return true;
            }
            target = target.parentElement;
        }
        return false;
    }

    private pauseEvent(e: Event): void {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
    }
}
