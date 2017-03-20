import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// import 'rxjs/add/operator/flatMap';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/merge';


//  Get the three major events
const mousemove = Observable.merge(
    Observable.fromEvent(document, 'mousemove'),
    Observable.fromEvent(document, 'touchmove', {passive: true})
);
const mouseup = Observable.merge(
    Observable.fromEvent(document, 'mouseup'),
    Observable.fromEvent(document, 'touchend'),
    Observable.fromEvent(document, 'touchcancel')
);

export function dragdrop(element: HTMLElement, config: {handlerClass?: string} = {}) {
    const mousedown = Observable.merge(
        Observable.fromEvent(element, 'mousedown'),
        Observable.fromEvent(element, 'touchstart')
    );

    const dragStart = mousedown
        .filter((md: Event) => {
            return !config.handlerClass ||
                (config.handlerClass && hasElementWithClass(config.handlerClass, <Element>md.target, element));
        })
        .do(pauseEvent)
        .switchMap((md: Event) => {
            const startCoords = md.type === 'touchstart' ?
                getTouchCoords(<TouchEvent>md) : getMouseCoords(<MouseEvent>md);

            return mousemove
                .filter((mm: Event) => {
                    const moveCoords = mm.type === 'touchmove' ?
                        getTouchCoords(<TouchEvent>mm) : getMouseCoords(<MouseEvent>mm);

                    return Math.abs(moveCoords.clientX - startCoords.clientX) > 5 ||
                        Math.abs(moveCoords.clientY - startCoords.clientY) > 5;
                })
                .takeUntil(mouseup)
                .take(1);
        }).share();

    function observeDragStart() {
        return dragStart;
    }

    function observeDrag(getElement?: Function) {
        getElement = getElement || function() { return element; };

        return observeDragStart().flatMap((mm: Event) => {
            const el = getElement();
            const moveCoords = mm.type === 'touchmove' ?
                getTouchCoords(<TouchEvent>mm) : getMouseCoords(<MouseEvent>mm);

            const coordinates = getRelativeCoordinates({pageX: moveCoords.pageX, pageY: moveCoords.pageY}, el);

            return mousemove.skip(1)
                .takeUntil(mouseup)
                .map((event: Event) => {
                    const moveCoords2 = event.type === 'touchmove' ?
                        getTouchCoords(<TouchEvent>event) : getMouseCoords(<MouseEvent>event);

                    return {
                        left: moveCoords2.clientX - coordinates.x,
                        top: moveCoords2.clientY - coordinates.y
                    };
                });
        }).filter(val => !!val);
    }

    function observeDrop() {
        return observeDragStart()
            .flatMap(() => {
                return mousemove.takeUntil(mouseup).last();
            })
            .do(() => {
                window.ontouchmove = null;
            });
    }

    return {
        observeDragStart,
        observeDrag,
        observeDrop
    };
};

function hasElementWithClass(className: string, target: Element, container: HTMLElement) {
    while (target !== container) {
        if (target.classList.contains(className)) {
            return true;
        }
        target = target.parentElement;
    }
    return false;
}

function getRelativeCoordinates(e: {pageX: number, pageY: number}, container: HTMLElement) {
    let offset;
    let ref;

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

function pauseEvent(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}

function getMouseCoords(e: MouseEvent): any {
    return {
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY
    };
}

function getTouchCoords(e: TouchEvent) {
    return {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        pageX: e.touches[0].pageX,
        pageY: e.touches[0].pageY
    };
}
