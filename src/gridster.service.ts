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

@Injectable()
export class GridsterService {
    $element: HTMLElement;

    gridList: GridList;

    items: Array<GridListItem> = [];
    _items: Array<GridListItem>;

    options: IGridsterOptions;
    draggableOptions: IGridsterDraggableOptions;
    draggableDefaults: IGridsterDraggableOptions = {
        zIndex: 2,
        scroll: false,
        containment: 'parent'
    };
    defaults: IGridsterOptions = {
        lanes: 5,
        direction: 'horizontal',
        itemSelector: 'li[data-w]',
        widthHeightRatio: 1,
        dragAndDrop: true,
        resizable: false
    };

    gridsterRect: ClientRect;
    gridsterOffset: {left: number, top: number};

    public gridsterChange: EventEmitter<any>;

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

    private gridsterComponent: GridsterComponent;

    constructor() {}

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
        this.options = (<any>Object).assign({}, this.defaults, options);
        this.draggableOptions = (<any>Object).assign(
            {}, this.draggableDefaults, draggableOptions);
    }

    start (gridsterEl: HTMLElement) {

        this.updateMaxItemSize();

        this.$element = gridsterEl;
        // Used to highlight a position an element will land on upon drop
        if (this.$positionHighlight) {
            this.$positionHighlight.style.display = 'none';
        }

        this.initGridList();
        this.reflow();
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

    private copyItems (): Array<GridListItem> {
        return this.items.map((item: GridListItem) => {
            return item.copy();
        });
    }

    onResizeStart(item: GridListItem) {
        this.currentElement = item.$element;

        this._items = this.copyItems();

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
        }

        if (positionChanged && !sizeChanged) {
            this.previousDragPosition = newPosition;

            this.gridList.moveItemToPosition(item, newPosition);
        } else if (sizeChanged && !positionChanged) {
            this.previousDragSize = newSize;

            this.gridList.resizeItem(item, {w: newSize[0], h: newSize[1]});
        } else if (sizeChanged && positionChanged) {
            this.previousDragPosition = newPosition;
            this.previousDragSize = newSize;

            this.gridList.moveAndResize(item, newPosition, {w: newSize[0], h: newSize[1]});
        }

        if (sizeChanged || positionChanged) {
            // Visually update item positions and highlight shape
            this.applyPositionToItems();
            this.highlightPositionForItem(item);
        }
    }

    onResizeStop() {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragSize = null;

        this.removePositionHighlight();

        this.gridList.pullItemsToLeft();
        this.render();

        this.gridsterComponent.isResizing = false;
    }

    onStart (item: GridListItem) {
        this.currentElement = item.$element;
        // itemCtrl.isDragging = true;
        // Create a deep copy of the items; we use them to revert the item
        // positions after each drag change, making an entire drag operation less
        // distructable
        this._items = this.copyItems();

        // Since dragging actually alters the grid, we need to establish the number
        // of cols (+1 extra) before the drag starts

        this._maxGridCols = this.gridList.grid.length;

        this.highlightPositionForItem(item);

        this.gridsterComponent.isDragging = true;
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
            this.applyPositionToItems();
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
        this.render();

        this.gridsterComponent.isDragging = false;
    }

    public getItemWidth (item) {
        return item.w * this.cellWidth;
    }

    public getItemHeight (item) {
        return item.h * this.cellHeight;
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
        this.items.forEach((item: GridListItem) => {
            const cachedItem = this._items.filter(cachedItm => {
                return cachedItm.$element === item.$element;
            })[0];

            item.x = cachedItem.x;
            item.y = cachedItem.y;
            item.w = cachedItem.w;
            item.h = cachedItem.h;
            item.autoSize = cachedItem.autoSize;
        });
    }

    private initGridList () {
        // Create instance of GridList (decoupled lib for handling the grid
        // positioning and sorting post-drag and dropping)
        this.gridList = new GridList(this.items, {
            lanes: this.options.lanes,
            direction: this.options.direction
        });
    }

    private calculateCellSize () {
        if (this.options.direction === 'horizontal') {
            // TODO: get rid of window.getComputedStyle
            this.cellHeight = Math.floor(parseFloat(window.getComputedStyle(this.$element).height) / this.options.lanes);
            this.cellWidth = this.cellHeight * this.options.widthHeightRatio;
        } else {
            // TODO: get rid of window.getComputedStyle
            this.cellWidth = Math.floor(parseFloat(window.getComputedStyle(this.$element).width) / this.options.lanes);
            this.cellHeight = this.cellWidth / this.options.widthHeightRatio;
        }
        if (this.options.heightToFontSizeRatio) {
            this._fontSize = this.cellHeight * this.options.heightToFontSizeRatio;
        }
    }

    private applySizeToItems () {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].$element.style.width = this.getItemWidth(this.items[i]) + 'px';
            this.items[i].$element.style.height = this.getItemHeight(this.items[i]) + 'px';

            if (this.options.heightToFontSizeRatio) {
                this.items[i].$element.style['font-size'] = this._fontSize;
            }
        }
    }

    private applyPositionToItems () {
        // TODO: Implement group separators
        for (let i = 0; i < this.items.length; i++) {
            // Don't interfere with the positions of the dragged items
            if (this.isCurrentElement(this.items[i].$element)) {
                continue;
            }
            this.items[i].$element.style.left = (this.items[i].x * this.cellWidth) + 'px';
            this.items[i].$element.style.top = (this.items[i].y * this.cellHeight) + 'px';
        }

        const child = <HTMLElement>this.$element.firstChild;
        // Update the width of the entire grid container with enough room on the
        // right to allow dragging items to the end of the grid.
        if (this.options.direction === 'horizontal') {
            child.style.height = (this.options.lanes * this.cellHeight) + 'px';
            child.style.width = ((this.gridList.grid.length + this.maxItemWidth) * this.cellWidth) + 'px';

        } else {
            child.style.height = ((this.gridList.grid.length + this.maxItemHeight) * this.cellHeight) + 'px';
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

        return [colSize, rowSize];
    }

    private snapItemPositionToGrid (item: GridListItem) {
        const position = this.offset(item.$element, this.$element);

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
        this.$positionHighlight.style.width = this.getItemWidth(item) + 'px';
        this.$positionHighlight.style.height = this.getItemHeight(item) + 'px';
        this.$positionHighlight.style.left = item.x * this.cellWidth + 'px';
        this.$positionHighlight.style.top = item.y * this.cellHeight + 'px';
        this.$positionHighlight.style.display = '';

        if (this.options.heightToFontSizeRatio) {
            this.$positionHighlight.style['font-size'] = this._fontSize;
        }
    }

    public updateCachedItems () {
        // Notify the user with the items that changed since the previous snapshot
        this.triggerOnChange();
        this._items = this.copyItems();
    }

    private triggerOnChange () {
        const itmsChanged = this.gridList.getChangedItems(this._items, '$element');
        if (itmsChanged.length > 0) {
            this.gridsterChange.emit(itmsChanged);
        }
    }

    private removePositionHighlight () {
        this.$positionHighlight.style.display = 'none';
    }

}
