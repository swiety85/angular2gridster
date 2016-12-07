import { OnInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ISubscription } from 'rxjs/Subscription';
import { GridsterService } from '../gridster.service';
export declare class GridsterItemComponent implements OnInit {
    x: number;
    y: number;
    w: number;
    h: number;
    el: HTMLElement;
    /**
     * Mouse drag observable
     */
    dragging: Observable<any>;
    /**
     * Gridster provider service
     */
    gridster: GridsterService;
    /**
     * Subscribtion for drag observable
     */
    dragSubscription: ISubscription;
    constructor(elementRef: ElementRef, gridster: GridsterService);
    ngOnInit(): void;
    /**
     * Checks if between target and container exists element with given class
     * @param target
     * @param container
     * @returns {boolean}
     */
    private hasElementWithClass(className, target, container);
    /**
     * Create and subscribe to drag event.
     * @param {HTMLElement} dragTarget
     */
    private createMouseDrag(dragTarget);
    private createTouchDrag(dragTarget);
    /**
     * Get coordinates of cursor relative to given container
     * @param {{pageX,pageY}} e
     * @param {HtmlElement} container
     * @return {{x: number, y: number}}
     */
    private getRelativeCoordinates(e, container);
    ngOnDestroy(): void;
}
