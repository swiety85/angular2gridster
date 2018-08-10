
import {DraggableEvent} from './DraggableEvent';

export const utils = {
    setCssElementPosition: function ($element: HTMLElement, position: {x: number, y: number}) {
        $element.style.left = position.x + 'px';
        $element.style.top = position.y + 'px';
    },
    resetCSSElementPosition: function ($element: HTMLElement) {
        $element.style.left = '';
        $element.style.top = '';
    },
    setTransform: function ($element: HTMLElement, position: {x: number, y: number}) {
        const left = position.x;
        const top = position.y;

        // Replace unitless items with px
        const translate = `translate(${left}px,${top}px)`;

        $element.style['transform'] = translate;
        (<any>$element.style)['WebkitTransform'] = translate;
        (<any>$element.style)['MozTransform'] = translate;
        (<any>$element.style)['msTransform'] = translate;
        (<any>$element.style)['OTransform'] = translate;
    },
    resetTransform: function ($element: HTMLElement) {
        $element.style['transform'] = '';
        (<any>$element.style)['WebkitTransform'] = '';
        (<any>$element.style)['MozTransform'] = '';
        (<any>$element.style)['msTransform'] = '';
        (<any>$element.style)['OTransform'] = '';
    },
    clearSelection: () => {
        if ((<any>document)['selection']) {
            (<any>document)['selection'].empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    },
    isElementFitContainer: function (element: HTMLElement, containerEl: HTMLElement): boolean {
        const containerRect = containerEl.getBoundingClientRect();
        const elRect = element.getBoundingClientRect();

        return elRect.left > containerRect.left &&
            elRect.right < containerRect.right &&
            elRect.top > containerRect.top &&
            elRect.bottom < containerRect.bottom;
    },
    isElementIntersectContainer: function (element: HTMLElement, containerEl: HTMLElement): boolean {
        const containerRect = containerEl.getBoundingClientRect();
        const elRect = element.getBoundingClientRect();

        const elWidth = elRect.right - elRect.left;
        const elHeight = elRect.bottom - elRect.top;

        return (elRect.left + (elWidth / 2)) > containerRect.left &&
            (elRect.right - (elWidth / 2)) < containerRect.right &&
            (elRect.top + (elHeight / 2)) > containerRect.top &&
            (elRect.bottom - (elHeight / 2)) < containerRect.bottom;
    },
    isElementTouchContainer: function (element: HTMLElement, containerEl: HTMLElement): boolean {
        const containerRect = containerEl.getBoundingClientRect();
        const elRect = element.getBoundingClientRect();

        return elRect.right > containerRect.left &&
            elRect.bottom > containerRect.top &&
            elRect.left < containerRect.right &&
            elRect.top < containerRect.bottom;
    },
    isCursorAboveElement: function (event: DraggableEvent, element: HTMLElement): boolean {
        const elRect = element.getBoundingClientRect();

        return event.pageX > elRect.left &&
            event.pageX < elRect.right &&
            event.pageY > elRect.top &&
            event.pageY < elRect.bottom;
    },
    getElementOuterHeight: function ($element: HTMLElement) {
        const styleObj = window.getComputedStyle($element);
        // NOTE: Manually calculating height because IE's `clientHeight` isn't always
        // reliable.
        return parseFloat(styleObj.getPropertyValue('height')) +
            parseFloat(styleObj.getPropertyValue('padding-top')) +
            parseFloat(styleObj.getPropertyValue('padding-bottom'));
    },
    getRelativeCoordinates: (element: HTMLElement, parentElement: HTMLElement): {top: number, left: number} => {
        const parentElementRect = parentElement.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        return {
            top: elementRect.top - parentElementRect.top,
            left: elementRect.left - parentElementRect.left
        };
    }
};
