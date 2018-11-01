import { Injectable } from '@angular/core';
import { Observable, Subject, merge } from 'rxjs';
import { takeUntil, switchMap, map, scan, filter, share, tap } from 'rxjs/operators';

import { GridsterService } from '../gridster.service';
import { GridsterItemPrototypeDirective } from './gridster-item-prototype.directive';
import { utils } from '../utils/utils';
import { DraggableEvent } from '../utils/DraggableEvent';

@Injectable()
export class GridsterPrototypeService {
    private isDragging = false;

    private dragSubject = new Subject<any>();

    private dragStartSubject = new Subject<any>();

    private dragStopSubject = new Subject<any>();

    constructor() {}

    observeDropOver(gridster: GridsterService) {
        return this.dragStopSubject.pipe(
            filter(data => {
                const gridsterEl = gridster.gridsterComponent.$element;
                const isOverNestedGridster = [].slice
                    .call(gridsterEl.querySelectorAll('gridster'))
                    .reduce((isOverGridster, nestedGridsterEl) => {
                        return (
                            isOverGridster ||
                            this.isOverGridster(
                                data.item,
                                nestedGridsterEl,
                                data.event,
                                gridster.options
                            )
                        );
                    }, false);

                if (isOverNestedGridster) {
                    return false;
                }

                return this.isOverGridster(data.item, gridsterEl, data.event, gridster.options);
            }),
            tap(data => {
                // TODO: what we should provide as a param?
                // prototype.drop.emit({item: prototype.item});
                data.item.onDrop(gridster);
            })
        );
    }

    observeDropOut(gridster: GridsterService) {
        return this.dragStopSubject.pipe(
            filter(data => {
                const gridsterEl = gridster.gridsterComponent.$element;

                return !this.isOverGridster(data.item, gridsterEl, data.event, gridster.options);
            }),
            tap(data => {
                // TODO: what we should provide as a param?
                data.item.onCancel();
            })
        );
    }

    observeDragOver(
        gridster: GridsterService
    ): {
        dragOver: Observable<GridsterItemPrototypeDirective>;
        dragEnter: Observable<GridsterItemPrototypeDirective>;
        dragOut: Observable<GridsterItemPrototypeDirective>;
    } {
        const over = this.dragSubject.pipe(
            map(data => {
                const gridsterEl = gridster.gridsterComponent.$element;

                return {
                    item: data.item,
                    event: data.event,
                    isOver: this.isOverGridster(
                        data.item,
                        gridsterEl,
                        data.event,
                        gridster.options
                    ),
                    isDrop: false
                };
            })
        );

        const drop = this.dragStopSubject.pipe(
            map(data => {
                const gridsterEl = gridster.gridsterComponent.$element;

                return {
                    item: data.item,
                    event: data.event,
                    isOver: this.isOverGridster(
                        data.item,
                        gridsterEl,
                        data.event,
                        gridster.options
                    ),
                    isDrop: true
                };
            })
        );

        const dragExt = merge(
            // dragStartSubject is connected in case when item prototype is placed above gridster
            // and drag enter is not fired
            this.dragStartSubject.pipe(map(() => ({ item: null, isOver: false, isDrop: false }))),
            over,
            drop
        ).pipe(
            scan((prev: any, next: any) => {
                return {
                    item: next.item,
                    event: next.event,
                    isOver: next.isOver,
                    isEnter: prev.isOver === false && next.isOver === true,
                    isOut: prev.isOver === true && next.isOver === false && !prev.isDrop,
                    isDrop: next.isDrop
                };
            }),
            filter((data: any) => {
                return !data.isDrop;
            }),
            share()
        );

        const dragEnter = this.createDragEnterObservable(dragExt, gridster);
        const dragOut = this.createDragOutObservable(dragExt, gridster);
        const dragOver = dragEnter.pipe(
            switchMap(() => this.dragSubject.pipe(takeUntil(dragOut))),
            map((data: any) => data.item)
        );

        return { dragEnter, dragOut, dragOver };
    }

    dragItemStart(item: GridsterItemPrototypeDirective, event: DraggableEvent) {
        this.isDragging = true;
        this.dragStartSubject.next({ item, event });
    }

    dragItemStop(item: GridsterItemPrototypeDirective, event: DraggableEvent) {
        this.isDragging = false;
        this.dragStopSubject.next({ item, event });
    }

    updatePrototypePosition(item: GridsterItemPrototypeDirective, event: DraggableEvent) {
        this.dragSubject.next({ item, event });
    }

    /**
     * Creates observable that is fired on dragging over gridster container.
     */
    private createDragOverObservable(
        dragIsOver: Observable<{ item: GridsterItemPrototypeDirective; isOver: boolean }>,
        gridster: GridsterService
    ) {
        return dragIsOver.pipe(
            filter((data: any) => data.isOver && !data.isEnter && !data.isOut),
            map((data: any): GridsterItemPrototypeDirective => data.item),
            tap(item => item.onOver(gridster))
        );
    }
    /**
     * Creates observable that is fired on drag enter gridster container.
     */
    private createDragEnterObservable(
        dragIsOver: Observable<{ item: GridsterItemPrototypeDirective; isOver: boolean }>,
        gridster: GridsterService
    ) {
        return dragIsOver.pipe(
            filter((data: any) => data.isEnter),
            map((data: any): GridsterItemPrototypeDirective => data.item),
            tap(item => item.onEnter(gridster))
        );
    }
    /**
     * Creates observable that is fired on drag out gridster container.
     */
    private createDragOutObservable(
        dragIsOver: Observable<{
            item: GridsterItemPrototypeDirective;
            isOver: boolean;
        }>,
        gridster: GridsterService
    ) {
        return dragIsOver.pipe(
            filter((data: any) => data.isOut),
            map((data: any): GridsterItemPrototypeDirective => data.item),
            tap(item => item.onOut(gridster))
        );
    }

    /**
     * Checks whether "element" position fits inside "containerEl" position.
     * It checks if "element" is totally covered by "containerEl" area.
     */
    private isOverGridster(
        item: GridsterItemPrototypeDirective,
        gridsterEl: HTMLElement,
        event,
        options
    ): boolean {
        const el = item.$element;
        const parentItem =
            <HTMLElement>gridsterEl.parentElement &&
            <HTMLElement>gridsterEl.parentElement.closest('gridster-item');

        if (parentItem) {
            return this.isOverGridster(item, parentItem, event, options);
        }

        return utils.isOverElement({
            draggEl: el,
            event,
            overEl: gridsterEl,
            tolerance: options.tolerance
        });
    }
}
