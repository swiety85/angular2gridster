import { Component, OnInit, ElementRef, Inject, Host, Input, Output,
    EventEmitter, SimpleChanges, OnChanges, OnDestroy, HostBinding,
    ChangeDetectionStrategy, AfterViewInit, NgZone, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { GridsterService } from '../gridster.service';
import { GridsterPrototypeService } from '../gridster-prototype/gridster-prototype.service';

import { GridListItem } from '../gridList/GridListItem';
import { DraggableEvent } from '../utils/DraggableEvent';
import { Draggable } from '../utils/draggable';
import { IGridsterOptions } from '../IGridsterOptions';
import { GridList } from '../gridList/gridList';
import { utils } from '../utils/utils';

@Component({
    selector: 'ngx-gridster-item',
    template: `<div class="gridster-item-inner">
      <ng-content></ng-content>
      <div class="gridster-item-resizable-handler handle-s"></div>
      <div class="gridster-item-resizable-handler handle-e"></div>
      <div class="gridster-item-resizable-handler handle-n"></div>
      <div class="gridster-item-resizable-handler handle-w"></div>
      <div class="gridster-item-resizable-handler handle-se"></div>
      <div class="gridster-item-resizable-handler handle-ne"></div>
      <div class="gridster-item-resizable-handler handle-sw"></div>
      <div class="gridster-item-resizable-handler handle-nw"></div>
    </div>`,
    styles: [`
    ngx-gridster-item {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        -webkit-transition: none;
        transition: none;
    }

    .gridster--ready ngx-gridster-item {
        transition: all 200ms ease;
        transition-property: left, top;
    }

    .gridster--ready.css-transform ngx-gridster-item  {
        transition-property: transform;
    }

    .gridster--ready ngx-gridster-item.is-dragging,
    .gridster--ready ngx-gridster-item.is-resizing {
        -webkit-transition: none;
        transition: none;
        z-index: 9999;
    }

    ngx-gridster-item.no-transition {
        -webkit-transition: none;
        transition: none;
    }
    ngx-gridster-item .gridster-item-resizable-handler {
        position: absolute;
        z-index: 2;
        display: none;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-n {
      cursor: n-resize;
      height: 10px;
      right: 0;
      top: 0;
      left: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-e {
      cursor: e-resize;
      width: 10px;
      bottom: 0;
      right: 0;
      top: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-s {
      cursor: s-resize;
      height: 10px;
      right: 0;
      bottom: 0;
      left: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-w {
      cursor: w-resize;
      width: 10px;
      left: 0;
      top: 0;
      bottom: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-ne {
      cursor: ne-resize;
      width: 10px;
      height: 10px;
      right: 0;
      top: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-nw {
      cursor: nw-resize;
      width: 10px;
      height: 10px;
      left: 0;
      top: 0;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-se {
      cursor: se-resize;
      width: 0;
      height: 0;
      right: 0;
      bottom: 0;
      border-style: solid;
      border-width: 0 0 10px 10px;
      border-color: transparent;
    }

    ngx-gridster-item .gridster-item-resizable-handler.handle-sw {
      cursor: sw-resize;
      width: 10px;
      height: 10px;
      left: 0;
      bottom: 0;
    }

    ngx-gridster-item:hover .gridster-item-resizable-handler.handle-se {
      border-color: transparent transparent #ccc
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GridsterItemComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() x: number;
    @Output() xChange = new EventEmitter<number>(true);
    @Input() y: number;
    @Output() yChange = new EventEmitter<number>(true);

    @Input() xSm: number;
    @Output() xSmChange = new EventEmitter<number>(true);
    @Input() ySm: number;
    @Output() ySmChange = new EventEmitter<number>(true);

    @Input() xMd: number;
    @Output() xMdChange = new EventEmitter<number>(true);
    @Input() yMd: number;
    @Output() yMdChange = new EventEmitter<number>(true);

    @Input() xLg: number;
    @Output() xLgChange = new EventEmitter<number>(true);
    @Input() yLg: number;
    @Output() yLgChange = new EventEmitter<number>(true);

    @Input() xXl: number;
    @Output() xXlChange = new EventEmitter<number>(true);
    @Input() yXl: number;
    @Output() yXlChange = new EventEmitter<number>(true);


    @Input() w: number;
    @Output() wChange = new EventEmitter<number>(true);
    @Input() h: number;
    @Output() hChange = new EventEmitter<number>(true);

    @Input() wSm: number;
    @Output() wSmChange = new EventEmitter<number>(true);
    @Input() hSm: number;
    @Output() hSmChange = new EventEmitter<number>(true);

    @Input() wMd: number;
    @Output() wMdChange = new EventEmitter<number>(true);
    @Input() hMd: number;
    @Output() hMdChange = new EventEmitter<number>(true);

    @Input() wLg: number;
    @Output() wLgChange = new EventEmitter<number>(true);
    @Input() hLg: number;
    @Output() hLgChange = new EventEmitter<number>(true);

    @Input() wXl: number;
    @Output() wXlChange = new EventEmitter<number>(true);
    @Input() hXl: number;
    @Output() hXlChange = new EventEmitter<number>(true);

    @Output() change = new EventEmitter<any>(true);
    @Output() start = new EventEmitter<any>(true);
    @Output() end = new EventEmitter<any>(true);

    @Input() dragAndDrop = true;
    @Input() resizable = true;

    @Input() options: any = {};

    autoSize: boolean;

    @HostBinding('class.is-dragging') isDragging = false;
    @HostBinding('class.is-resizing') isResizing = false;

    $element: HTMLElement;
    elementRef: ElementRef;
    /**
     * Gridster provider service
     */
    gridster: GridsterService;

    item: GridListItem;

    set positionX(value: number) {
        this._positionX = value;
    }
    get positionX() {
        return this._positionX;
    }
    set positionY(value: number) {
        this._positionY = value;
    }
    get positionY() {
        return this._positionY;
    }
    private _positionX: number;
    private _positionY: number;

    private defaultOptions: any = {
        minWidth: 1,
        minHeight: 1,
        maxWidth: Infinity,
        maxHeight: Infinity,
        defaultWidth: 1,
        defaultHeight: 1
    };
    private subscriptions: Array<Subscription> = [];
    private dragSubscriptions: Array<Subscription> = [];
    private resizeSubscriptions: Array<Subscription> = [];

    constructor(private zone: NgZone,
                private gridsterPrototypeService: GridsterPrototypeService,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(GridsterService) gridster: GridsterService) {

        this.gridster = gridster;
        this.elementRef = elementRef;
        this.$element = elementRef.nativeElement;

        this.item = (new GridListItem()).setFromGridsterItem(this);

        // if gridster is initialized do not show animation on new grid-item construct
        if (this.gridster.isInitialized()) {
            this.preventAnimation();
        }
    }

    ngOnInit() {
        this.options = Object.assign(this.defaultOptions, this.options);

        this.w = this.w || this.options.defaultWidth;
        this.h = this.h || this.options.defaultHeight;
        this.wSm = this.wSm || this.w;
        this.hSm = this.hSm || this.h;
        this.wMd = this.wMd || this.w;
        this.hMd = this.hMd || this.h;
        this.wLg = this.wLg || this.w;
        this.hLg = this.hLg || this.h;
        this.wXl = this.wXl || this.w;
        this.hXl = this.hXl || this.h;

        if (this.gridster.isInitialized()) {
            this.setPositionsOnItem();
        }

        this.gridster.registerItem(this.item);

        this.gridster.calculateCellSize();
        this.item.applySize();
        this.item.applyPosition();

        if (this.gridster.options.dragAndDrop && this.dragAndDrop) {
            this.enableDragDrop();
        }

        if (this.gridster.isInitialized()) {
            this.gridster.render();
            this.gridster.updateCachedItems();
        }
    }

    ngAfterViewInit() {
        if (this.gridster.options.resizable && this.item.resizable) {
            this.enableResizable();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.gridster.gridList) {
            return;
        }
        let rerender = false;

        ['w', ...Object.keys(GridListItem.W_PROPERTY_MAP).map(breakpoint => GridListItem.W_PROPERTY_MAP[breakpoint])]
        .filter(propName => changes[propName] && !changes[propName].isFirstChange())
        .forEach((propName: string) => {
            if (changes[propName].currentValue > this.options.maxWidth) {
                this[propName] = this.options.maxWidth;
                setTimeout(() => this[propName + 'Change'].emit(this[propName]));
            }
            rerender = true;
        });

        ['h', ...Object.keys(GridListItem.H_PROPERTY_MAP).map(breakpoint => GridListItem.H_PROPERTY_MAP[breakpoint])]
            .filter(propName => changes[propName] && !changes[propName].isFirstChange())
            .forEach((propName: string) => {
                if (changes[propName].currentValue > this.options.maxHeight) {
                    this[propName] = this.options.maxHeight;
                    setTimeout(() => this[propName + 'Change'].emit(this[propName]));
                }
                rerender = true;
            });

        ['x', 'y',
        ...Object.keys(GridListItem.X_PROPERTY_MAP).map(breakpoint => GridListItem.X_PROPERTY_MAP[breakpoint]),
        ...Object.keys(GridListItem.Y_PROPERTY_MAP).map(breakpoint => GridListItem.Y_PROPERTY_MAP[breakpoint])]
            .filter(propName => changes[propName] && !changes[propName].isFirstChange())
            .forEach((propName: string) => rerender = true);

        if (changes['dragAndDrop'] && !changes['dragAndDrop'].isFirstChange()) {
            if (changes['dragAndDrop'].currentValue && this.gridster.options.dragAndDrop) {
                this.enableDragDrop();
            } else {
                this.disableDraggable();
            }
        }
        if (changes['resizable'] && !changes['resizable'].isFirstChange()) {
            if (changes['resizable'].currentValue && this.gridster.options.resizable) {
                this.enableResizable();
            } else {
                this.disableResizable();
            }
        }

        if (rerender && this.gridster.gridsterComponent.isReady) {
            this.gridster.debounceRenderSubject.next();
        }
    }

    ngOnDestroy() {
        this.gridster.removeItem(this.item);
        this.gridster.itemRemoveSubject.next(this.item);

        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
        this.disableDraggable();
        this.disableResizable();
    }

    updateElemenetPosition() {
        if (this.gridster.options.useCSSTransforms) {
            utils.setTransform(this.$element, {x: this._positionX, y: this._positionY});
        } else {
            utils.setCssElementPosition(this.$element, {x: this._positionX, y: this._positionY});
        }
    }

    setPositionsOnItem() {
        if (!this.item.hasPositions(this.gridster.options.breakpoint)) {
            this.setPositionsForGrid(this.gridster.options);
        }

        this.gridster.gridsterOptions.responsiveOptions
            .filter((options: IGridsterOptions) => !this.item.hasPositions(options.breakpoint))
            .forEach((options: IGridsterOptions) => this.setPositionsForGrid(options));
    }

    public enableResizable() {
        if (this.resizeSubscriptions.length) {
            return;
        }

        this.zone.runOutsideAngular(() => {
            this.getResizeHandlers().forEach((handler) => {
                const direction = this.getResizeDirection(handler);

                if (this.hasResizableHandle(direction)) {
                    handler.style.display = 'block';
                }

                const draggable = new Draggable(handler, this.getResizableOptions());

                let startEvent;
                let startData;
                let cursorToElementPosition;

                const dragStartSub = draggable.dragStart
                    .subscribe((event: DraggableEvent) => {
                        this.zone.run(() => {
                            this.isResizing = true;

                            startEvent = event;
                            startData = this.createResizeStartObject(direction);
                            cursorToElementPosition = event.getRelativeCoordinates(this.$element);

                            this.gridster.onResizeStart(this.item);
                            this.onStart('resize');
                        });
                    });

                const dragSub = draggable.dragMove
                    .subscribe((event: DraggableEvent) => {
                        const scrollData = this.gridster.gridsterScrollData;

                        this.resizeElement({
                            direction,
                            startData,
                            position: {
                                x: event.clientX - cursorToElementPosition.x - this.gridster.gridsterRect.left,
                                y: event.clientY - cursorToElementPosition.y - this.gridster.gridsterRect.top
                            },
                            startEvent,
                            moveEvent: event,
                            scrollDiffX: scrollData.scrollLeft - startData.scrollLeft,
                            scrollDiffY: scrollData.scrollTop - startData.scrollTop
                        });

                        this.gridster.onResizeDrag(this.item);
                    });

                const dragStopSub = draggable.dragStop
                    .subscribe(() => {
                        this.zone.run(() => {
                            this.isResizing = false;

                            this.gridster.onResizeStop(this.item);
                            this.onEnd('resize');
                        });
                    });

                this.resizeSubscriptions = this.resizeSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);

            });
        });
    }

    public disableResizable() {
        this.resizeSubscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
        this.resizeSubscriptions = [];

        [].forEach.call(this.$element.querySelectorAll('.gridster-item-resizable-handler'), (handler) => {
            handler.style.display = '';
        });
    }

    public enableDragDrop() {
        if (this.dragSubscriptions.length) {
            return;
        }
        this.zone.runOutsideAngular(() => {
            let cursorToElementPosition;

            const draggable = new Draggable(this.$element, this.getDraggableOptions());

            const dragStartSub = draggable.dragStart
                .subscribe((event: DraggableEvent) => {
                    this.zone.run(() => {
                        this.gridster.onStart(this.item);
                        this.isDragging = true;
                        this.onStart('drag');

                        cursorToElementPosition = event.getRelativeCoordinates(this.$element);
                    });
                });

            const dragSub = draggable.dragMove
                .subscribe((event: DraggableEvent) => {

                    this.positionY = (event.clientY - cursorToElementPosition.y -
                        this.gridster.gridsterRect.top);
                    this.positionX = (event.clientX - cursorToElementPosition.x -
                        this.gridster.gridsterRect.left);
                    this.updateElemenetPosition();

                    this.gridster.onDrag(this.item);
                });

            const dragStopSub = draggable.dragStop
                .subscribe(() => {
                    this.zone.run(() => {
                        this.gridster.onStop(this.item);
                        this.gridster.debounceRenderSubject.next();
                        this.isDragging = false;
                        this.onEnd('drag');
                    });
                });

            this.dragSubscriptions = this.dragSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);
        });
    }

    public disableDraggable() {
        this.dragSubscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
        this.dragSubscriptions = [];
    }

    private getResizeHandlers(): HTMLElement[]  {
        return [].filter.call(this.$element.children[0].children, (el) => {

            return el.classList.contains('gridster-item-resizable-handler');
        });
    }

    private getDraggableOptions() {
        return { scrollDirection: this.gridster.options.direction, ...this.gridster.draggableOptions };
    }

    private getResizableOptions() {
        const resizableOptions: any = {};

        if (this.gridster.draggableOptions.scroll || this.gridster.draggableOptions.scroll === false) {
            resizableOptions.scroll = this.gridster.draggableOptions.scroll;
        }
        if (this.gridster.draggableOptions.scrollEdge) {
            resizableOptions.scrollEdge = this.gridster.draggableOptions.scrollEdge;
        }

        resizableOptions.scrollDirection = this.gridster.options.direction;

        return resizableOptions;
    }

    private hasResizableHandle(direction: string): boolean {
        const isItemResizable = this.gridster.options.resizable && this.item.resizable;
        const resizeHandles = this.gridster.options.resizeHandles;

        return isItemResizable && (!resizeHandles || (resizeHandles && !!resizeHandles[direction]));
    }

    private setPositionsForGrid(options: IGridsterOptions) {
        let x, y;

        const position = this.findPosition(options);
        x = options.direction === 'horizontal' ? position[0] : position[1];
        y = options.direction === 'horizontal' ? position[1] : position[0];

        this.item.setValueX(x, options.breakpoint);
        this.item.setValueY(y, options.breakpoint);

        setTimeout(() => {
            this.item.triggerChangeX(options.breakpoint);
            this.item.triggerChangeY(options.breakpoint);
        });
    }

    private findPosition(options: IGridsterOptions): Array<number> {
        const gridList = new GridList(
            this.gridster.items.map(item => item.copyForBreakpoint(options.breakpoint)),
            options
        );

        return gridList.findPositionForItem(this.item, {x: 0, y: 0});
    }

    private createResizeStartObject(direction: string) {
        const scrollData = this.gridster.gridsterScrollData;

        return {
            top: this.positionY,
            left: this.positionX,
            height: parseInt(this.$element.style.height, 10),
            width: parseInt(this.$element.style.width, 10),
            minX: Math.max(this.item.x + this.item.w - this.options.maxWidth, 0),
            maxX: this.item.x + this.item.w - this.options.minWidth,
            minY: Math.max(this.item.y + this.item.h - this.options.maxHeight, 0),
            maxY: this.item.y + this.item.h - this.options.minHeight,
            minW: this.options.minWidth,
            maxW: Math.min(
                this.options.maxWidth,
                (this.gridster.options.direction === 'vertical' && direction.indexOf('w') < 0) ?
                this.gridster.options.lanes - this.item.x : this.options.maxWidth,
                direction.indexOf('w') >= 0 ?
                this.item.x + this.item.w : this.options.maxWidth
            ),
            minH: this.options.minHeight,
            maxH: Math.min(
                this.options.maxHeight,
                (this.gridster.options.direction === 'horizontal' && direction.indexOf('n') < 0) ?
                this.gridster.options.lanes - this.item.y : this.options.maxHeight,
                direction.indexOf('n') >= 0 ?
                this.item.y + this.item.h : this.options.maxHeight
            ),
            scrollLeft: scrollData.scrollLeft,
            scrollTop: scrollData.scrollTop
        };
    }

    private onEnd(actionType: string): void {
        this.end.emit({action: actionType, item: this.item});
    }

    private onStart(actionType: string): void {
        this.start.emit({action: actionType, item: this.item});
    }

    /**
     * Assign class for short while to prevent animation of grid item component
     */
    private preventAnimation(): GridsterItemComponent {
        this.$element.classList.add('no-transition');
        setTimeout(() => {
            this.$element.classList.remove('no-transition');
        }, 500);

        return this;
    }

    private getResizeDirection(handler: Element): string {
        for (let i = handler.classList.length - 1; i >= 0; i--) {
            if (handler.classList[i].match('handle-')) {
                return handler.classList[i].split('-')[1];
            }
        }
    }

    private resizeElement(config: any): void {
        // north
        if (config.direction.indexOf('n') >= 0) {
            this.resizeToNorth(config);
        }
        // west
        if (config.direction.indexOf('w') >= 0) {
            this.resizeToWest(config);
        }
        // east
        if (config.direction.indexOf('e') >= 0) {
            this.resizeToEast(config);
        }
        // south
        if (config.direction.indexOf('s') >= 0) {
            this.resizeToSouth(config);
        }
    }

    private resizeToNorth(config: any): void {
        const height = config.startData.height + config.startEvent.clientY -
            config.moveEvent.clientY - config.scrollDiffY;

        if (height < (config.startData.minH * this.gridster.cellHeight)) {
            this.setMinHeight('n', config);
        } else if (height > (config.startData.maxH * this.gridster.cellHeight)) {
            this.setMaxHeight('n', config);
        } else {
            this.positionY = config.position.y;
            this.$element.style.height = height + 'px';
        }
    }

    private resizeToWest(config: any): void {
        const width = config.startData.width + config.startEvent.clientX -
            config.moveEvent.clientX - config.scrollDiffX;

        if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('w', config);
        } else if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('w', config);
        } else {
            this.positionX = config.position.x;
            this.updateElemenetPosition();
            this.$element.style.width = width + 'px';
        }
    }

    private resizeToEast(config: any): void {
        const width = config.startData.width + config.moveEvent.clientX -
            config.startEvent.clientX + config.scrollDiffX;

        if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('e', config);
        } else if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('e', config);
        } else {
            this.$element.style.width = width + 'px';
        }
    }

    private resizeToSouth(config: any): void {
        const height = config.startData.height + config.moveEvent.clientY -
            config.startEvent.clientY + config.scrollDiffY;

        if (height > config.startData.maxH * this.gridster.cellHeight) {
            this.setMaxHeight('s', config);
        } else if (height < config.startData.minH * this.gridster.cellHeight) {
            this.setMinHeight('s', config);
        } else {
            this.$element.style.height = height + 'px';
        }
    }

    private setMinHeight(direction: string, config: any): void {
        if (direction === 'n') {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
            this.positionY = config.startData.maxY * this.gridster.cellHeight;
        } else {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
        }
    }

    private setMinWidth(direction: string, config: any): void {
        if (direction === 'w') {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
            this.positionX = config.startData.maxX * this.gridster.cellWidth;
            this.updateElemenetPosition();
        } else {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
        }
    }

    private setMaxHeight(direction: string, config: any): void {

        if (direction === 'n') {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
            this.positionY = config.startData.minY * this.gridster.cellHeight;
        } else {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
        }
    }

    private setMaxWidth(direction: string, config: any): void {

        if (direction === 'w') {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
            this.positionX = config.startData.minX * this.gridster.cellWidth;
            this.updateElemenetPosition();
        } else {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
        }
    }
}
