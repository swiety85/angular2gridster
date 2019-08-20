import {
    Component,
    OnInit,
    AfterContentInit,
    OnDestroy,
    ElementRef,
    ViewChild,
    NgZone,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    HostBinding,
    ViewEncapsulation
} from '@angular/core';
import {
    Observable,
    Subscription,
    fromEvent,
    ConnectableObservable
} from 'rxjs';
import { debounceTime, filter, publish } from 'rxjs/operators';

import { utils } from './utils/utils';
import { GridsterService } from './gridster.service';
import { IGridsterOptions } from './IGridsterOptions';
import { IGridsterDraggableOptions } from './IGridsterDraggableOptions';
import { GridsterPrototypeService } from './gridster-prototype/gridster-prototype.service';
import { GridsterItemPrototypeDirective } from './gridster-prototype/gridster-item-prototype.directive';
import { GridListItem } from './gridList/GridListItem';
import { GridsterOptions } from './GridsterOptions';

@Component({
    selector: 'ngx-gridster',
    template: `<div class="gridster-container">
      <ng-content></ng-content>
      <div class="position-highlight" style="display:none;" #positionHighlight>
        <div class="inner"></div>
      </div>
    </div>`,
    styles: [
        `
            ngx-gridster {
                position: relative;
                display: block;
                left: 0;
                width: 100%;
            }

            ngx-gridster.gridster--dragging {
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            ngx-gridster .gridster-container {
                position: relative;
                width: 100%;
                list-style: none;
                -webkit-transition: width 0.2s, height 0.2s;
                transition: width 0.2s, height 0.2s;
            }

            ngx-gridster .position-highlight {
                display: block;
                position: absolute;
                z-index: 1;
            }
        `
    ],
    providers: [GridsterService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GridsterComponent implements OnInit, AfterContentInit, OnDestroy {
    @Input() options: IGridsterOptions;
    @Output() optionsChange = new EventEmitter<any>();
    @Output() ready = new EventEmitter<any>();
    @Output() reflow = new EventEmitter<any>();
    @Output() prototypeDrop = new EventEmitter<{ item: GridListItem }>();
    @Output() prototypeEnter = new EventEmitter<{ item: GridListItem }>();
    @Output() prototypeOut = new EventEmitter<{ item: GridListItem }>();
    @Input() draggableOptions: IGridsterDraggableOptions = {};
    @Input() parent: GridsterComponent;

    @ViewChild('positionHighlight', { static: true }) $positionHighlight;
    @HostBinding('class.gridster--dragging') isDragging = false;
    @HostBinding('class.gridster--resizing') isResizing = false;

    @HostBinding('class.gridster--ready') isReady = false;
    gridster: GridsterService;
    $element: HTMLElement;

    gridsterOptions: GridsterOptions;
    isPrototypeEntered = false;
    private isDisabled = false;
    private subscription = new Subscription();

    constructor(
        private zone: NgZone,
        elementRef: ElementRef,
        gridster: GridsterService,
        private gridsterPrototype: GridsterPrototypeService
    ) {
        this.gridster = gridster;
        this.$element = elementRef.nativeElement;
    }

    ngOnInit() {
        this.gridsterOptions = new GridsterOptions(this.options, this.$element);

        if (this.options.useCSSTransforms) {
            this.$element.classList.add('css-transform');
        }

        this.subscription.add(
            this.gridsterOptions.change.subscribe(options => {
                this.gridster.options = options;
                if (this.gridster.gridList) {
                    this.gridster.gridList.options = options;
                }
                this.optionsChange.emit(options);
            })
        );

        this.gridster.init(this);

        this.subscription.add(
            fromEvent(window, 'resize')
                .pipe(
                    debounceTime(this.gridster.options.responsiveDebounce || 0),
                    filter(() => this.gridster.options.responsiveView)
                )
                .subscribe(() => this.reload())
        );

        this.zone.runOutsideAngular(() => {
            this.subscription.add(
                fromEvent(document, 'scroll', { passive: true }).subscribe(() =>
                    this.updateGridsterElementData()
                )
            );
            const scrollableContainer = utils.getScrollableContainer(this.$element);
            if (scrollableContainer) {
                this.subscription.add(
                    fromEvent(scrollableContainer, 'scroll', { passive: true })
                    .subscribe(() =>
                        this.updateGridsterElementData()
                    )
                );
            }
        });
    }

    ngAfterContentInit() {
        this.gridster.start();

        this.updateGridsterElementData();

        this.connectGridsterPrototype();

        this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Change gridster config option and rebuild
     * @param string name
     * @param any value
     * @return GridsterComponent
     */
    setOption(name: string, value: any) {
        if (name === 'dragAndDrop') {
            if (value) {
                this.enableDraggable();
            } else {
                this.disableDraggable();
            }
        }
        if (name === 'resizable') {
            if (value) {
                this.enableResizable();
            } else {
                this.disableResizable();
            }
        }
        if (name === 'lanes') {
            this.gridster.options.lanes = value;

            this.gridster.gridList.fixItemsPositions(this.gridster.options);
            this.reflowGridster();
        }
        if (name === 'direction') {
            this.gridster.options.direction = value;
            this.gridster.gridList.pullItemsToLeft();
        }
        if (name === 'widthHeightRatio') {
            this.gridster.options.widthHeightRatio = parseFloat(value || 1);
        }
        if (name === 'responsiveView') {
            this.gridster.options.responsiveView = !!value;
        }
        this.gridster.gridList.setOption(name, value);

        return this;
    }

    reload() {
        setTimeout(() => {
            this.gridster.fixItemsPositions();
            this.reflowGridster();
        });

        return this;
    }

    reflowGridster(isInit = false) {
        this.gridster.reflow();
        this.reflow.emit({
            isInit: isInit,
            gridsterComponent: this
        });
    }

    updateGridsterElementData() {
        this.gridster.gridsterScrollData = this.getScrollPositionFromParents(
            this.$element
        );
        this.gridster.gridsterRect = this.$element.getBoundingClientRect();
    }

    setReady() {
        setTimeout(() => (this.isReady = true));
        this.ready.emit();
    }

    adjustItemsHeightToContent(
        scrollableItemElementSelector: string = '.gridster-item-inner'
    ) {
        this.gridster.items
            // convert each item to object with information about content height and scroll height
            .map((item: GridListItem) => {
                const scrollEl = item.$element.querySelector(
                    scrollableItemElementSelector
                );
                const contentEl = scrollEl.lastElementChild;
                const scrollElDistance = utils.getRelativeCoordinates(
                    scrollEl,
                    item.$element
                );
                const scrollElRect = scrollEl.getBoundingClientRect();
                const contentRect = contentEl.getBoundingClientRect();

                return {
                    item,
                    contentHeight: contentRect.bottom - scrollElRect.top,
                    scrollElDistance
                };
            })
            // calculate required height in lanes amount and update item "h"
            .forEach(data => {
                data.item.h = Math.ceil(<any>(
                    (data.contentHeight /
                        (this.gridster.cellHeight - data.scrollElDistance.top))
                ));
            });

        this.gridster.fixItemsPositions();
        this.gridster.reflow();
    }

    disable(item) {
        const itemIdx = this.gridster.items.indexOf(item.itemComponent);

        this.isDisabled = true;
        if (itemIdx >= 0) {
            delete this.gridster.items[
                this.gridster.items.indexOf(item.itemComponent)
            ];
        }
        this.gridster.onDragOut(item);
    }

    enable() {
        this.isDisabled = false;
    }

    private getScrollPositionFromParents(
        element: Element,
        data = { scrollTop: 0, scrollLeft: 0 }
    ): { scrollTop: number; scrollLeft: number } {
        if (element.parentElement && element.parentElement !== document.body) {
            data.scrollTop += element.parentElement.scrollTop;
            data.scrollLeft += element.parentElement.scrollLeft;

            return this.getScrollPositionFromParents(
                element.parentElement,
                data
            );
        }

        return {
            scrollTop: data.scrollTop,
            scrollLeft: data.scrollLeft
        };
    }

    /**
     * Connect gridster prototype item to gridster dragging hooks (onStart, onDrag, onStop).
     */
    private connectGridsterPrototype() {
        this.gridsterPrototype.observeDropOut(this.gridster).subscribe();

        const dropOverObservable = <ConnectableObservable<any>>(
            this.gridsterPrototype
                .observeDropOver(this.gridster)
                .pipe(publish())
        );

        const dragObservable = this.gridsterPrototype.observeDragOver(
            this.gridster
        );

        dragObservable.dragOver
            .pipe(filter(() => !this.isDisabled))
            .subscribe((prototype: GridsterItemPrototypeDirective) => {
                if (!this.isPrototypeEntered) {
                    return;
                }
                this.gridster.onDrag(prototype.item);
            });

        dragObservable.dragEnter
            .pipe(filter(() => !this.isDisabled))
            .subscribe((prototype: GridsterItemPrototypeDirective) => {
                this.isPrototypeEntered = true;

                if (this.gridster.items.indexOf(prototype.item) < 0) {
                    this.gridster.items.push(prototype.item);
                }
                this.gridster.onStart(prototype.item);
                prototype.setDragContextGridster(this.gridster);

                if (this.parent) {
                    this.parent.disable(prototype.item);
                }
                this.prototypeEnter.emit({ item: prototype.item });
            });

        dragObservable.dragOut
            .pipe(filter(() => !this.isDisabled))
            .subscribe((prototype: GridsterItemPrototypeDirective) => {
                if (!this.isPrototypeEntered) {
                    return;
                }
                this.gridster.onDragOut(prototype.item);
                this.isPrototypeEntered = false;

                this.prototypeOut.emit({ item: prototype.item });

                if (this.parent) {
                    this.parent.enable();

                    this.parent.isPrototypeEntered = true;
                    if (
                        this.parent.gridster.items.indexOf(prototype.item) < 0
                    ) {
                        this.parent.gridster.items.push(prototype.item);
                    }
                    this.parent.gridster.onStart(prototype.item);
                    prototype.setDragContextGridster(this.parent.gridster);
                    // timeout is needed to be sure that "enter" event is fired after "out"
                    setTimeout(() => {
                        this.parent.prototypeEnter.emit({
                            item: prototype.item
                        });
                        prototype.onEnter(this.parent.gridster);
                    });
                }
            });

        dropOverObservable
            .pipe(filter(() => !this.isDisabled))
            .subscribe(data => {
                if (!this.isPrototypeEntered) {
                    return;
                }

                this.gridster.onStop(data.item.item);
                this.gridster.removeItem(data.item.item);

                this.isPrototypeEntered = false;
                if (this.parent) {
                    this.parent.enable();
                }
                this.prototypeDrop.emit({ item: data.item.item });
            });

        dropOverObservable.connect();
    }

    private enableDraggable() {
        this.gridster.options.dragAndDrop = true;

        this.gridster.items
            .filter(
                item => item.itemComponent && item.itemComponent.dragAndDrop
            )
            .forEach((item: GridListItem) =>
                item.itemComponent.enableDragDrop()
            );
    }

    private disableDraggable() {
        this.gridster.options.dragAndDrop = false;

        this.gridster.items
            .filter(item => item.itemComponent)
            .forEach((item: GridListItem) =>
                item.itemComponent.disableDraggable()
            );
    }

    private enableResizable() {
        this.gridster.options.resizable = true;

        this.gridster.items
            .filter(item => item.itemComponent && item.itemComponent.resizable)
            .forEach((item: GridListItem) =>
                item.itemComponent.enableResizable()
            );
    }

    private disableResizable() {
        this.gridster.options.resizable = false;

        this.gridster.items.forEach((item: GridListItem) =>
            item.itemComponent.disableResizable()
        );
    }
}
