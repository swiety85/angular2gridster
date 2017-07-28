import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';


import { GridList } from './gridList/gridList';
import { GridsterItemComponent } from './gridster-item/gridster-item.component';
import { IGridsterOptions } from './IGridsterOptions';
import { IGridsterDraggableOptions } from './IGridsterDraggableOptions';
import { GridsterPrototypeService } from './gridster-prototype/gridster-prototype.service';
import { GridsterItemPrototypeDirective } from './gridster-prototype/gridster-item-prototype.directive';
import { GridListItem } from './gridList/GridListItem';
import { GridsterComponent } from './gridster.component';
import {GridsterOptions} from './GridsterOptions';

@Injectable()
export class GridsterService {
    $element: HTMLElement;

    gridList: GridList;

    items: Array<GridListItem> = [];
    _items: Array<GridListItem>;
    _itemsMap: {[breakpoint: string]: Array<GridListItem>} = {};
    disabledItems: Array<GridListItem> = [];

    options: IGridsterOptions;
    draggableOptions: IGridsterDraggableOptions;
    draggableDefaults: IGridsterDraggableOptions = {
        zIndex: 2,
        scroll: false,
        containment: 'parent'
    };

    gridsterRect: ClientRect;

    gridsterOptions: GridsterOptions;

    gridsterComponent: GridsterComponent;

    public $positionHighlight: HTMLElement;

    public maxItemWidth: number;
    public maxItemHeight: number;

    public cellWidth: number;
    public cellHeight: number;
    private _fontSize: number;

    private previousDragPosition: Array<number>;
    private previousDragSize: Array<number>;

    private currentElement: HTMLElement;

    private _maxGridCols: number;

    private isInit = false;

    constructor() {}

    isInitialized(): boolean {
        return this.isInit;
    }

    /**
     * Must be called before init
     * @param item
     */
    registerItem(item: GridListItem) {

        this.items.push(item);
        return item;
    }

    init (options: IGridsterOptions = {}, draggableOptions: IGridsterDraggableOptions = {}, gridsterComponent: GridsterComponent) {

        this.gridsterComponent = gridsterComponent;

        this.draggableOptions = (<any>Object).assign(
            {}, this.draggableDefaults, draggableOptions);

        this.gridsterOptions = gridsterComponent.gridsterOptions;
    }

    start () {

        this.updateMaxItemSize();

        // Used to highlight a position an element will land on upon drop
        if (this.$positionHighlight) {
            this.$positionHighlight.style.display = 'none';
        }

        this.initGridList();

        this.isInit = true;

        setTimeout(() => {
            this.copyItems();
            this.fixItemsPositions();

            this.reflow();
        });
    }

    initGridList () {
        // Create instance of GridList (decoupled lib for handling the grid
        // positioning and sorting post-drag and dropping)
        this.gridList = new GridList(this.items, this.options);
    }

    render () {
        this.updateMaxItemSize();
        this.gridList.generateGrid();
        this.applySizeToItems();
        this.applyPositionToItems();
    }

    reflow () {
        this.calculateCellSize();
        this.render();
    }

    fixItemsPositions() {
        this.gridList.fixItemsPositions(this.gridsterOptions.basicOptions);
        this.gridsterOptions.responsiveOptions.forEach((options: IGridsterOptions) => {
            this.gridList.fixItemsPositions(options);
        });
    }

    onResizeStart(item: GridListItem) {
        this.currentElement = item.$element;

        this.copyItems();

        this._maxGridCols = this.gridList.grid.length;

        this.highlightPositionForItem(item);

        this.gridsterComponent.isResizing = true;
    }

    onResizeDrag(item: GridListItem) {
        const newSize = this.snapItemSizeToGrid(item);
        const sizeChanged = this.dragSizeChanged(newSize);
        const newPosition = this.snapItemPositionToGrid(item);
        const positionChanged = this.dragPositionChanged(newPosition);

        if (sizeChanged || positionChanged) {
            // Regenerate the grid with the positions from when the drag started
            this.restoreCachedItems();
            this.gridList.generateGrid();

            this.previousDragPosition = newPosition;
            this.previousDragSize = newSize;

            this.gridList.moveAndResize(item, newPosition, {w: newSize[0], h: newSize[1]});

            // Visually update item positions and highlight shape
            this.applyPositionToItems(true);
            this.highlightPositionForItem(item);
        }
    }

    onResizeStop(item: GridListItem) {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragSize = null;

        this.removePositionHighlight();

        this.gridList.pullItemsToLeft();
        this.render();

        this.gridsterComponent.isResizing = false;

        this.fixItemsPositions();
    }

    onStart (item: GridListItem) {
        this.currentElement = item.$element;
        // itemCtrl.isDragging = true;
        // Create a deep copy of the items; we use them to revert the item
        // positions after each drag change, making an entire drag operation less
        // distructable
        this.copyItems();

        // Since dragging actually alters the grid, we need to establish the number
        // of cols (+1 extra) before the drag starts

        this._maxGridCols = this.gridList.grid.length;

        this.highlightPositionForItem(item);

        this.gridsterComponent.isDragging = true;
        this.gridsterComponent.updateGridsterElementData();
    }

    onDrag (item: GridListItem) {
        const newPosition = this.snapItemPositionToGrid(item);

        if (this.dragPositionChanged(newPosition)) {
            this.previousDragPosition = newPosition;

            // Regenerate the grid with the positions from when the drag started
            this.restoreCachedItems();
            this.gridList.generateGrid();

            // Since the items list is a deep copy, we need to fetch the item
            // corresponding to this drag action again
            this.gridList.moveItemToPosition(item, newPosition);

            // Visually update item positions and highlight shape
            this.applyPositionToItems(true);
            this.highlightPositionForItem(item);
        }
    }

    onDragOut (item: GridListItem) {

        this.previousDragPosition = null;
        this.updateMaxItemSize();
        this.applyPositionToItems();
        this.removePositionHighlight();
        this.currentElement = undefined;

        const idx = this.items.indexOf(item);
        this.items.splice(idx, 1);

        this.gridList.pullItemsToLeft();
        this.render();
    }

    onStop (item: GridListItem) {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragPosition = null;

        // itemCtrl.isDragging = false;

        this.removePositionHighlight();

        this.gridList.pullItemsToLeft();

        this.gridsterComponent.isDragging = false;
    }

    public offset (el: HTMLElement, relativeEl: HTMLElement): {left: number, top: number, right: number, bottom: number} {
        const elRect = el.getBoundingClientRect();
        const relativeElRect = relativeEl.getBoundingClientRect();

        return {
            left: elRect.left - relativeElRect.left,
            top: elRect.top - relativeElRect.top,
            right: relativeElRect.right - elRect.right,
            bottom: relativeElRect.bottom - elRect.bottom
        };
    }

    private copyItems (): void {
        this._items = this.items.map((item: GridListItem) => {
            return item.copyForBreakpoint(null);
        });

        this.gridsterOptions.responsiveOptions.forEach((options: IGridsterOptions) => {
            this._itemsMap[options.breakpoint] = this.items.map((item: GridListItem) => {
                return item.copyForBreakpoint(options.breakpoint);
            });
        });
    }

    /**
     * Update maxItemWidth and maxItemHeight vales according to current state of items
     */
    private updateMaxItemSize () {
        this.maxItemWidth = Math.max.apply(
            null, this.items.map((item) => { return item.w; }));
        this.maxItemHeight = Math.max.apply(
            null, this.items.map((item) => { return item.h; }));
    }

    /**
     * Update items properties of previously cached items
     */
    private restoreCachedItems() {
        const items = this.options.breakpoint ? this._itemsMap[this.options.breakpoint] : this._items;

        this.items.forEach((item: GridListItem) => {
            const cachedItem: GridListItem = items.filter(cachedItm => {
                return cachedItm.$element === item.$element;
            })[0];

            item.x = cachedItem.x;
            item.y = cachedItem.y;

            item.w = cachedItem.w;
            item.h = cachedItem.h;
            item.autoSize = cachedItem.autoSize;
        });
    }

    calculateCellSize () {
        if (this.options.direction === 'horizontal') {
            // TODO: get rid of window.getComputedStyle
            this.cellHeight = Math.floor(parseFloat(window.getComputedStyle(this.gridsterComponent.$element).height) / this.options.lanes);
            this.cellWidth = this.cellHeight * this.options.widthHeightRatio;
        } else {
            // TODO: get rid of window.getComputedStyle
            this.cellWidth = Math.floor(parseFloat(window.getComputedStyle(this.gridsterComponent.$element).width) / this.options.lanes);
            this.cellHeight = this.cellWidth / this.options.widthHeightRatio;
        }
        if (this.options.heightToFontSizeRatio) {
            this._fontSize = this.cellHeight * this.options.heightToFontSizeRatio;
        }
    }

    private applySizeToItems () {
        for (let i = 0; i < this.items.length; i++) {
            // this.items[i].$element.style.width = this.items[i].calculateWidth() + 'px';
            // this.items[i].$element.style.height = this.items[i].calculateHeight() + 'px';
            this.items[i].applySize();

            if (this.options.heightToFontSizeRatio) {
                this.items[i].$element.style['font-size'] = this._fontSize;
            }
        }
    }

    applyPositionToItems (increaseGridsterSize?) {
        if (!this.options.shrink) {
            increaseGridsterSize = true;
        }
        // TODO: Implement group separators
        for (let i = 0; i < this.items.length; i++) {
            // Don't interfere with the positions of the dragged items
            if (this.isCurrentElement(this.items[i].$element)) {
                continue;
            }
            // this.items[i].$element.style.left = (this.items[i].x * this.cellWidth) + 'px';
            // this.items[i].$element.style.top = (this.items[i].y * this.cellHeight) + 'px';
            this.items[i].applyPosition(this);
        }

        const child = <HTMLElement>this.gridsterComponent.$element.firstChild;
        // Update the width of the entire grid container with enough room on the
        // right to allow dragging items to the end of the grid.
        if (this.options.direction === 'horizontal') {
            const increaseWidthWith = (increaseGridsterSize) ? this.maxItemWidth : 0;
            child.style.height = (this.options.lanes * this.cellHeight) + 'px';
            child.style.width = ((this.gridList.grid.length + increaseWidthWith) * this.cellWidth) + 'px';

        } else {
            const increaseHeightWith = (increaseGridsterSize) ? this.maxItemHeight : 0;
            child.style.height = ((this.gridList.grid.length + increaseHeightWith) * this.cellHeight) + 'px';
            child.style.width = (this.options.lanes * this.cellWidth) + 'px';
        }
    }

    private isCurrentElement (element) {
        if (!this.currentElement) {
            return false;
        }
        return element === this.currentElement;
    }

    private snapItemSizeToGrid(item: GridListItem): Array<number> {
        const itemSize = {
            width: parseInt(item.$element.style.width, 10) - 1,
            height: parseInt(item.$element.style.height, 10) - 1
        };

        let colSize = Math.round(itemSize.width / this.cellWidth);
        let rowSize = Math.round(itemSize.height / this.cellHeight);

        // Keep item minimum 1
        colSize = Math.max(colSize, 1);
        rowSize = Math.max(rowSize, 1);

        // check if element is pinned
        if (this.gridList.isOverFixedArea(item.x, item.y, colSize, rowSize, item)) {
            return [item.w, item.h];
        }

        return [colSize, rowSize];
    }

    private snapItemPositionToGrid (item: GridListItem) {
        const position = this.offset(item.$element, this.gridsterComponent.$element);

        let col = Math.round(position.left / this.cellWidth),
            row = Math.round(position.top / this.cellHeight);

        // Keep item position within the grid and don't let the item create more
        // than one extra column
        col = Math.max(col, 0);
        row = Math.max(row, 0);

        if (this.options.direction === 'horizontal') {
            col = Math.min(col, this._maxGridCols);
            row = Math.min(row, this.options.lanes - item.h);

        } else {
            col = Math.min(col, this.options.lanes - item.w);
            row = Math.min(row, this._maxGridCols);
        }

        // check if element is pinned
        if (this.gridList.isOverFixedArea(col, row, item.w, item.h)) {
            return [item.x, item.y];
        }

        return [col, row];
    }

    private dragSizeChanged (newSize): boolean {
        if (!this.previousDragSize) {
            return true;
        }
        return (newSize[0] !== this.previousDragSize[0] ||
            newSize[1] !== this.previousDragSize[1]);
    }

    private dragPositionChanged (newPosition): boolean {
        if (!this.previousDragPosition) {
            return true;
        }
        return (newPosition[0] !== this.previousDragPosition[0] ||
        newPosition[1] !== this.previousDragPosition[1]);
    }

    private highlightPositionForItem (item: GridListItem) {
        const size = item.calculateSize(this);
        const position = item.calculatePosition(this);

        this.$positionHighlight.style.width = size.width + 'px';
        this.$positionHighlight.style.height = size.height + 'px';
        this.$positionHighlight.style.left = position.left + 'px';
        this.$positionHighlight.style.top = position.top + 'px';
        this.$positionHighlight.style.display = '';

        if (this.options.heightToFontSizeRatio) {
            this.$positionHighlight.style['font-size'] = this._fontSize;
        }
    }

    public updateCachedItems () {
        // Notify the user with the items that changed since the previous snapshot
        this.triggerOnChange(null);
        this.gridsterOptions.responsiveOptions.forEach((options: IGridsterOptions) => {
            this.triggerOnChange(options.breakpoint);
        });

        this.copyItems();
    }

    private triggerOnChange (breakpoint?) {
        const items = breakpoint ? this._itemsMap[breakpoint] : this._items;
        const changeItems = this.gridList.getChangedItems(items, breakpoint);

        changeItems
            .filter((itemChange: any) => {
                return itemChange.item.itemComponent;
            })
            .forEach((itemChange: any) => {

                if (itemChange.changes.indexOf('x') >= 0) {
                    itemChange.item.triggerChangeX(breakpoint);
                }
                if (itemChange.changes.indexOf('y') >= 0) {
                    itemChange.item.triggerChangeY(breakpoint);
                }
                // size change should be called only once (not for each breakpoint)
                if (!breakpoint && itemChange.changes.indexOf('w') >= 0) {
                    itemChange.item.itemComponent.wChange.emit(itemChange.item.w);
                }
                if (!breakpoint && itemChange.changes.indexOf('h') >= 0) {
                    itemChange.item.itemComponent.hChange.emit(itemChange.item.h);
                }
                // should be called only once (not for each breakpoint)
                itemChange.item.itemComponent.change.emit({
                    item: itemChange.item,
                    changes: itemChange.changes,
                    breakpoint: breakpoint
                });
            });
    }

    private removePositionHighlight () {
        this.$positionHighlight.style.display = 'none';
    }

}
