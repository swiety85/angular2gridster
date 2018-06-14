import { Observable } from 'rxjs';
import { pairwise, filter } from 'rxjs/operators';

import { DraggableEvent } from './DraggableEvent';

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
        $element.style['WebkitTransform'] = translate;
        $element.style['MozTransform'] = translate;
        $element.style['msTransform'] = translate;
        $element.style['OTransform'] = translate;
    },
    resetTransform: function ($element: HTMLElement) {
        $element.style['transform'] = '';
        $element.style['WebkitTransform'] = '';
        $element.style['MozTransform'] = '';
        $element.style['msTransform'] = '';
        $element.style['OTransform'] = '';
    },
    clearSelection: () => {
        if (document['selection']) {
            document['selection'].empty();
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
    isCursorAboveElement: function (event: DraggableEvent, element): boolean {
        const elRect = element.getBoundingClientRect();

        return event.pageX > elRect.left &&
            event.pageX < elRect.right &&
            event.pageY > elRect.top &&
            event.pageY < elRect.bottom;
    },
    isOverElement({draggEl, event, overEl, tolerance = 'pointer'}): boolean {
        switch (tolerance) {
            case 'fit':
                return this.isElementFitContainer(draggEl, overEl);
            case 'intersect':
                return this.isElementIntersectContainer(draggEl, overEl);
            case 'touch':
                return this.isElementTouchContainer(draggEl, overEl);
            case 'pointer':
            default:
                return this.isCursorAboveElement(event, overEl);
        }
    },
    getElementOuterHeight: function ($element: HTMLElement) {
        const styleObj = window.getComputedStyle($element);
        // NOTE: Manually calculating height because IE's `clientHeight` isn't always
        // reliable.
        return parseFloat(styleObj.getPropertyValue('height')) +
            parseFloat(styleObj.getPropertyValue('padding-top')) +
            parseFloat(styleObj.getPropertyValue('padding-bottom'));
    },
    getRelativeCoordinates: (element, parentElement): {top: number, left: number} => {
        const parentElementRect = parentElement.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        return {
            top: elementRect.top - parentElementRect.top,
            left: elementRect.left - parentElementRect.left
        };
    }
};
