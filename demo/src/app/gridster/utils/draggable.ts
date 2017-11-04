import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';

import { DraggableEvent } from './DraggableEvent';
import { utils } from './utils';

export class Draggable {
    element: Element;

    dragStart: Observable<DraggableEvent>;
    dragMove: Observable<DraggableEvent>;
    dragStop: Observable<DraggableEvent>;

    private mousemove: Observable<{} | Event> = Observable.merge(
        Observable.fromEvent(document, 'mousemove'),
        Observable.fromEvent(document, 'touchmove', {passive: true})
    ).share();

    private mouseup: Observable<{} | Event> = Observable.merge(
        Observable.fromEvent(document, 'mouseup'),
        Observable.fromEvent(document, 'touchend'),
        Observable.fromEvent(document, 'touchcancel')
    ).share();

    private mousedown: Observable<{} | Event>;

    private config = {
        handlerClass: null
    };

    constructor(element: Element, config: {handlerClass?: string} = {}) {
        this.element = element;
        this.mousedown = Observable.merge(
            Observable.fromEvent(element, 'mousedown'),
            Observable.fromEvent(element, 'touchstart')
        ).share();

        this.config.handlerClass = config.handlerClass;

        this.dragStart = this.createDragStartObservable().share();
        this.dragMove = this.createDragMoveObservable(this.dragStart);
        this.dragStop = this.createDragStopObservable(this.dragStart);

        this.fixProblemWithDnDForIE(element);
    }

    private createDragStartObservable(): Observable<DraggableEvent> {
        return this.mousedown
            .map(md => new DraggableEvent(md))
            .filter((event: DraggableEvent) => this.isDragingByHandler(event))
            .do(e => {
                e.pauseEvent();
                (<any>document.activeElement).blur();
                // prevents rendering performance issues while dragging item with selection inside
                utils.clearSelection();
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
            .switchMap(() => {
                return this.mousemove
                    .skip(1)
                    .map(mm => new DraggableEvent(mm))
                    .takeUntil(this.mouseup);
            })
            .filter(val => !!val);
    }

    private createDragStopObservable(dragStart: Observable<DraggableEvent>): Observable<any> {
        return dragStart
            .switchMap(() => {
                return this.mouseup.take(1);
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

    private fixProblemWithDnDForIE(element: Element) {
        if (this.isTouchDevice() && this.isIEorEdge()) {
            (<HTMLElement>element).style['touch-action'] = 'none';
        }
    }

    private isTouchDevice() {
        return 'ontouchstart' in window  // works on most browsers
            || navigator.maxTouchPoints; // works on IE10/11 and Surface
    }

    private isIEorEdge() {
        const ua = window.navigator.userAgent;

        const msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        const trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            const rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        const edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }
}
