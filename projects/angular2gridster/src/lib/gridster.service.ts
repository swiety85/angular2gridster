import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { GridList } from './gridList/gridList';
import { IGridsterOptions } from './IGridsterOptions';
import { IGridsterDraggableOptions } from './IGridsterDraggableOptions';
import { GridListItem } from './gridList/GridListItem';
import { GridsterComponent } from './gridster.component';
import { GridsterOptions } from './GridsterOptions';

@Injectable()
export class GridsterService {
    $element: HTMLElement;

    gridList: GridList;

    items: Array<GridListItem> = [];
    _items: Array<GridListItem> = [];
    _itemsMap: { [breakpoint: string]: Array<GridListItem> } = {};
    disabledItems: Array<GridListItem> = [];

    options: IGridsterOptions;
    draggableOptions: IGridsterDraggableOptions;

    gridsterRect: ClientRect;
    gridsterScrollData: { scrollTop: number, scrollLeft: number };

    gridsterOptions: GridsterOptions;

    gridsterComponent: GridsterComponent;

    debounceRenderSubject = new Subject();

    public $positionHighlight: HTMLElement;

    public maxItemWidth: number;
    public maxItemHeight: number;

    public cellWidth: number;
    public cellHeight: number;

    public itemRemoveSubject: Subject<GridListItem> = new Subject();

    private _fontSize: number;

    private previousDragPosition: Array<number>;
    private previousDragSize: Array<number>;

    private currentElement: HTMLElement;

    private _maxGridCols: number;

    private isInit = false;

    constructor() {
        this.itemRemoveSubject.pipe(debounceTime(0)).subscribe(() => {
            this.gridList.pullItemsToLeft();
            this.render();
            this.updateCachedItems();
        });

        this.debounceRenderSubject.pipe(debounceTime(0)).subscribe(() => this.render());
    }

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

    init(gridsterComponent: GridsterComponent) {

        this.gridsterComponent = gridsterComponent;

        this.draggableOptions = gridsterComponent.draggableOptions;

        this.gridsterOptions = gridsterComponent.gridsterOptions;
    }

    start() {
        this.updateMaxItemSize();

        // Used to highlight a position an element will land on upon drop
        if (this.$positionHighlight) {
            this.removePositionHighlight();
        }

        this.initGridList();

        this.isInit = true;

        setTimeout(() => {
            this.copyItems();
            this.fixItemsPositions();

            this.gridsterComponent.reflowGridster(true);
            this.gridsterComponent.setReady();
        });
    }

    initGridList() {
        // Create instance of GridList (decoupled lib for handling the grid
        // positioning and sorting post-drag and dropping)
        this.gridList = new GridList(this.items, this.options);
    }

    render() {
        this.updateMaxItemSize();
        this.gridList.generateGrid();
        this.applySizeToItems();
        this.applyPositionToItems();
        this.refreshLines();
    }

    reflow() {
        this.calculateCellSize();
        this.render();
    }

    fixItemsPositions() {
        if (this.options.responsiveSizes) {
            this.gridList.fixItemsPositions(this.options);
        } else {
            this.gridList.fixItemsPositions(this.gridsterOptions.basicOptions);
            this.gridsterOptions.responsiveOptions.forEach((options: IGridsterOptions) => {
                this.gridList.fixItemsPositions(options);
            });
        }

        this.updateCachedItems();
    }

    removeItem(item: GridListItem) {
        const idx = this.items.indexOf(item);

        if (idx >= 0) {
            this.items.splice(this.items.indexOf(item), 1);
        }

        this.gridList.deleteItemPositionFromGrid(item);
        this.removeItemFromCache(item);
    }

    onResizeStart(item: GridListItem) {
        this.currentElement = item.$element;

        this.copyItems();

        this._maxGridCols = this.gridList.grid.length;

        this.highlightPositionForItem(item);

        this.gridsterComponent.isResizing = true;

        this.refreshLines();
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

        this.gridsterComponent.isResizing = false;

        this.gridList.pullItemsToLeft(item);
        this.debounceRenderSubject.next();

        this.fixItemsPositions();
    }

    onStart(item: GridListItem) {
        this.currentElement = item.$element;
        // itemCtrl.isDragging = true;
        // Create a deep copy of the items; we use them to revert the item
        // positions after each drag change, making an entire drag operation less
        // distructable
        this.copyItems();

        // Since dragging actually alters the grid, we need to establish the number
        // of cols (+1 extra) before the drag starts

        this._maxGridCols = this.gridList.grid.length;

        this.gridsterComponent.isDragging = true;
        this.gridsterComponent.updateGridsterElementData();

        this.refreshLines();
    }

    onDrag(item: GridListItem) {
        const newPosition = this.snapItemPositionToGrid(item);

        if (this.dragPositionChanged(newPosition)) {

            // Regenerate the grid with the positions from when the drag started
            this.restoreCachedItems();
            this.gridList.generateGrid();

            this.previousDragPosition = newPosition;
            if (this.options.direction === 'none' &&
                !this.gridList.checkItemAboveEmptyArea(item, {x: newPosition[0], y: newPosition[1]})) {
                return;
            }

            // Since the items list is a deep copy, we need to fetch the item
            // corresponding to this drag action again
            this.gridList.moveItemToPosition(item, newPosition);

            // Visually update item positions and highlight shape
            this.applyPositionToItems(true);
            this.highlightPositionForItem(item);
        }
    }

    cancel() {
        this.restoreCachedItems();
        this.previousDragPosition = null;
        this.updateMaxItemSize();
        this.applyPositionToItems();
        this.removePositionHighlight();
        this.currentElement = undefined;
        this.gridsterComponent.isDragging = false;
    }

    onDragOut (item: GridListItem) {

        this.cancel();

        const idx = this.items.indexOf(item);
        if (idx >= 0) {
            this.items.splice(idx, 1);
        }

        this.gridList.pullItemsToLeft();
        this.render();
    }

    onStop(item: GridListItem) {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragPosition = null;

        this.removePositionHighlight();

        this.gridList.pullItemsToLeft(item);

        this.gridsterComponent.isDragging = false;

        this.refreshLines();
    }

    calculateCellSize() {
        if (this.options.direction === 'horizontal') {
            this.cellHeight = this.calculateCellHeight();
            this.cellWidth = this.options.cellWidth || this.cellHeight * this.options.widthHeightRatio;
        } else {
            this.cellWidth = this.calculateCellWidth();
            this.cellHeight = this.options.cellHeight || this.cellWidth / this.options.widthHeightRatio;
        }
        if (this.options.heightToFontSizeRatio) {
            this._fontSize = this.cellHeight * this.options.heightToFontSizeRatio;
        }
    }

    applyPositionToItems(increaseGridsterSize?) {
        if (!this.options.shrink) {
            increaseGridsterSize = true;
        }
        // TODO: Implement group separators
        for (let i = 0; i < this.items.length; i++) {
            // Don't interfere with the positions of the dragged items
            if (this.isCurrentElement(this.items[i].$element)) {
                continue;
            }
            this.items[i].applyPosition(this);
        }

        const child = <HTMLElement>this.gridsterComponent.$element.firstChild;
        // Update the width of the entire grid container with enough room on the
        // right to allow dragging items to the end of the grid.
        if (this.options.direction === 'horizontal') {
            const increaseWidthWith = (increaseGridsterSize) ? this.maxItemWidth : 0;
            child.style.height = '';
            child.style.width = ((this.gridList.grid.length + increaseWidthWith) * this.cellWidth) + 'px';

        } else if (this.gridList.grid.length) {
            const increaseHeightWith = (increaseGridsterSize) ? this.maxItemHeight : 0;
            // todo: fix me
            const rowHeights = this.getRowHeights();
            const rowTops = this.getRowTops(rowHeights);
            child.style.height = (rowTops[rowTops.length - 1] + rowHeights[rowHeights.length - 1]) + 'px';
            child.style.width = '';
        }
    }

    getRowHeights(): number[] {
        const result = [];
        for (let row = 0; row < this.gridList.grid.length; row++) {
            result.push(0);
            for (let column = 0; column < this.gridList.grid[row].length; column++) {
                const item = this.gridList.grid[row][column];
                if (item) {
                    const contentHeight = item.itemComponent.contentWrapper.nativeElement.offsetheight || 0;
                    const childHeight = item.$element.firstChild.offsetHeight || 0;
                    const baseHeight = Math.max(contentHeight, childHeight);
                    const height = baseHeight / item.h;
                    if (item.variableHeight && item.variableHeightStretchRows && height > result[row]) {
                        console.log('row ' + row + ' has variable height, using value ' + baseHeight + ' from ' + item.x + ', ' + item.y);
                        result[row] = height;
                    }
                }
            }
            if (result[row] === 0) {
                result[row] = this.cellHeight;
            }
        }
        return result;
    }

    getRowTops(rowHeights: number[]): number[] {
        let result = [];
        let lastHeight = 0;
        for (let rowHeight of rowHeights) {
            result.push(lastHeight);
            lastHeight += rowHeight;
        }
        return result;
    }

    refreshLines() {
        const gridsterContainer = <HTMLElement>this.gridsterComponent.$element.firstChild;

        if (this.options.lines && this.options.lines.visible &&
            (this.gridsterComponent.isDragging || this.gridsterComponent.isResizing || this.options.lines.always)) {
            const linesColor = this.options.lines.color || '#d8d8d8';
            const linesBgColor = this.options.lines.backgroundColor || 'transparent';
            const linesWidth = this.options.lines.width || 1;
            const bgPosition = linesWidth / 2;

            gridsterContainer.style.backgroundSize = `${this.cellWidth}px ${this.cellHeight}px`;
            gridsterContainer.style.backgroundPosition = `-${bgPosition}px -${bgPosition}px`;
            gridsterContainer.style.backgroundImage = `
                linear-gradient(to right, ${linesColor} ${linesWidth}px, ${linesBgColor} ${linesWidth}px),
                linear-gradient(to bottom, ${linesColor} ${linesWidth}px, ${linesBgColor} ${linesWidth}px)
            `;
        } else {
            gridsterContainer.style.backgroundSize = '';
            gridsterContainer.style.backgroundPosition = '';
            gridsterContainer.style.backgroundImage = '';
        }
    }

    private removeItemFromCache(item: GridListItem) {
        this._items = this._items
            .filter(cachedItem => cachedItem.$element !== item.$element);

        Object.keys(this._itemsMap)
            .forEach((breakpoint: string) => {
                this._itemsMap[breakpoint] = this._itemsMap[breakpoint]
                    .filter(cachedItem => cachedItem.$element !== item.$element);
            });
    }

    private copyItems(): void {
        this._items = this.items
            .filter(item => this.isValidGridItem(item))
            .map((item: GridListItem) => {
                return item.copyForBreakpoint(null);
            });

        this.gridsterOptions.responsiveOptions.forEach((options: IGridsterOptions) => {
            this._itemsMap[options.breakpoint] = this.items
                .filter(item => this.isValidGridItem(item))
                .map((item: GridListItem) => {
                    return item.copyForBreakpoint(options.breakpoint);
                });
        });
    }

    /**
     * Update maxItemWidth and maxItemHeight vales according to current state of items
     */
    private updateMaxItemSize() {
        this.maxItemWidth = Math.max.apply(
            null, this.items.map((item) => {
                return item.w;
            }));
        this.maxItemHeight = Math.max.apply(
            null, this.items.map((item) => {
                return item.h;
            }));
    }

    /**
     * Update items properties of previously cached items
     */
    private restoreCachedItems() {
        const items = this.options.breakpoint ? this._itemsMap[this.options.breakpoint] : this._items;

        this.items
            .filter(item => this.isValidGridItem(item))
            .forEach((item: GridListItem) => {
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

    /**
     * If item should react on grid
     * @param GridListItem item
     * @returns boolean
     */
    private isValidGridItem(item: GridListItem): boolean {
        if (this.options.direction === 'none') {
            return !!item.itemComponent;
        }
        return true;
    }

    private calculateCellWidth() {
        const gridsterWidth = parseFloat(window.getComputedStyle(this.gridsterComponent.$element).width);

        return Math.floor(gridsterWidth / this.options.lanes);
    }

    private calculateCellHeight() {
        const gridsterHeight = parseFloat(window.getComputedStyle(this.gridsterComponent.$element).height);

        return Math.floor(gridsterHeight / this.options.lanes);
    }

    private applySizeToItems() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].applySize();

            if (this.options.heightToFontSizeRatio) {
                this.items[i].$element.style['font-size'] = this._fontSize;
            }
        }
    }

    private isCurrentElement(element) {
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

    private generateItemPosition(item: GridListItem): { x: number, y: number } {
        let position;

        if (item.itemPrototype) {
            const coords = item.itemPrototype.getPositionToGridster(this);
            position = {
                x: Math.round(coords.x / this.cellWidth),
                y: Math.round(coords.y / this.cellHeight)
            };
        } else {
            position = {
                x: Math.round(item.positionX / this.cellWidth),
                y: Math.round(item.positionY / this.cellHeight)
            };
        }

        return position;
    }

    private snapItemPositionToGrid(item: GridListItem) {
        const position = this.generateItemPosition(item);
        let col = position.x;
        let row = position.y;

        // Keep item position within the grid and don't let the item create more
        // than one extra column
        col = Math.max(col, 0);
        row = Math.max(row, 0);

        if (this.options.direction === 'horizontal') {
            col = Math.min(col, this._maxGridCols);
        } else {
            col = Math.min(col, Math.max(0, this.options.lanes - item.w));
        }

        // check if element is pinned
        if (this.gridList.isOverFixedArea(col, row, item.w, item.h)) {
            return [item.x, item.y];
        }

        return [col, row];
    }

    private dragSizeChanged(newSize): boolean {
        if (!this.previousDragSize) {
            return true;
        }
        return (newSize[0] !== this.previousDragSize[0] ||
            newSize[1] !== this.previousDragSize[1]);
    }

    private dragPositionChanged(newPosition): boolean {
        if (!this.previousDragPosition) {
            return true;
        }
        return (newPosition[0] !== this.previousDragPosition[0] ||
            newPosition[1] !== this.previousDragPosition[1]);
    }

    private highlightPositionForItem(item) {
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

    public updateCachedItems() {
        // Notify the user with the items that changed since the previous snapshot
        this.triggerOnChange(null);
        this.gridsterOptions.responsiveOptions.forEach((options: IGridsterOptions) => {
            this.triggerOnChange(options.breakpoint);
        });

        this.copyItems();
    }

    private triggerOnChange(breakpoint?) {
        const items = breakpoint ? this._itemsMap[breakpoint] : this._items;
        const changeItems = this.gridList.getChangedItems(items || [], breakpoint);

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
                if (itemChange.changes.indexOf('w') >= 0) {
                    itemChange.item.triggerChangeW(breakpoint);
                }
                if (itemChange.changes.indexOf('h') >= 0) {
                    itemChange.item.triggerChangeH(breakpoint);
                }
                // should be called only once (not for each breakpoint)
                itemChange.item.itemComponent.change.emit({
                    item: itemChange.item,
                    oldValues: itemChange.oldValues || {},
                    isNew: itemChange.isNew,
                    changes: itemChange.changes,
                    breakpoint: breakpoint
                });
            });
    }

    private removePositionHighlight() {
        this.$positionHighlight.style.display = 'none';
    }

}
