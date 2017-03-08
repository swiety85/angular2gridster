import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//import 'rxjs/add/operator/flatMap';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';


// Get the three major events
const mousemove = Observable.fromEvent(document, 'mousemove');
const mouseup = Observable.fromEvent(document, 'mouseup');

export function dragdrop(element: HTMLElement, config: {handlerClass?: string} = {}) {
    const mousedown = Observable.fromEvent(element, 'mousedown');

    function observeDragStart() {
        return mousedown
            .do((md: MouseEvent) => {
                pauseEvent(md);
            })
            .filter((md: MouseEvent) => {
                return !config.handlerClass ||
                    (config.handlerClass && hasElementWithClass(config.handlerClass, <Element>md.target, element));
            })
            .switchMap((md: MouseEvent) => {

                return mousemove
                    .do((mm: MouseEvent) => {
                        pauseEvent(mm);
                    })
                    .filter((mm: MouseEvent) => {
                        return Math.abs(mm.clientX - md.clientX) > 5 ||
                            Math.abs(mm.clientY - md.clientY) > 5;
                    })
                    .takeUntil(mouseup)
                    .take(1);
            });
    }

    function observeDrag(getElement?: Function) {
        getElement = getElement || function() { return element; };

        return observeDragStart().flatMap((mm:MouseEvent) => {
            const element = getElement();

            const coordinates = getRelativeCoordinates({pageX: mm.pageX, pageY: mm.pageY}, element);

            pauseEvent(mm);

            return mousemove.skip(1)
                .takeUntil(mouseup)
                .do((mm: MouseEvent) => {
                    pauseEvent(mm);
                })
                .map((event: MouseEvent) => {
                    return {
                        left: event.clientX - coordinates.x,
                        top: event.clientY - coordinates.y
                    };
                });
        }).filter(val => val);
    }

    function observeDrop() {
        return observeDragStart().flatMap(() => {
            return mousemove
                .takeUntil(mouseup).last();
        });
    }

    return {
        observeDragStart,
        observeDrag,
        observeDrop
    };
};

function hasElementWithClass(className:string, target:Element, container:HTMLElement) {
    while(target !== container) {
        if(target.classList.contains(className)) {
            return true;
        }
        target = target.parentElement;
    }
    return false;
}

function getRelativeCoordinates(e:{pageX:number,pageY:number}, container:HTMLElement) {
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

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}