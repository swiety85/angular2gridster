import { GridList } from './gridList/gridList';
import { EventEmitter } from '@angular/core';
import {GridsterItemComponent} from "./gridster-item/gridster-item.component";

export interface IGridsterDraggableOptions {
    handlerClass?:string;
    zIndex?:number;
    scroll?:boolean;
    containment?:string;
}
export interface IGridsterOptions {
    direction?:string;
    lanes?:number;
    widthHeightRatio?:number;
    heightToFontSizeRatio?:number;
    onChange?:Function;
    dragAndDrop?:boolean;
    itemSelector?: string;
}

export class GridsterService {
    $element:HTMLElement;

    gridList:GridList;

    items:Array<GridsterItemComponent> = [];
    _items:Array<any>;

    options:IGridsterOptions;
    draggableOptions:IGridsterDraggableOptions;
    draggableDefaults:IGridsterDraggableOptions = {
        zIndex: 2,
        scroll: false,
        containment: "parent"
    };
    defaults:IGridsterOptions = {
        lanes: 5,
        direction: "horizontal",
        itemSelector: 'li[data-w]',
        widthHeightRatio: 1,
        dragAndDrop: true
    };
    public gridsterChange: EventEmitter<any>;

    private maxItemWidth:number; // old _widestItem
    private maxItemHeight:number; // old _tallestItem
    public $positionHighlight:HTMLElement;

    private previousDragPosition:Array<number>;

    private draggedElement:HTMLElement;

    private _maxGridCols:number;

    private _cellWidth:number;
    private _cellHeight:number;
    private _fontSize:number;

    constructor() {}

    /**
     * Must be called before init
     * @param item
     */
    registerItem(item:GridsterItemComponent) {
        this.items.push(item);

        return item;

    }

    init (options:IGridsterOptions = {}, draggableOptions:IGridsterDraggableOptions = {}) {

        this.options = (<any>Object).assign({}, this.defaults, options);
        this.draggableOptions = (<any>Object).assign(
            {}, this.draggableDefaults, draggableOptions);
    }

    start (gridsterEl:HTMLElement) {

        this.updateMaxItemSize();

        this.$element = gridsterEl;
        // Used to highlight a position an element will land on upon drop
        if(this.$positionHighlight) {
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

    serializeItems () {
        return this.items.map((item:GridsterItemComponent) => {
            return item.serialize();
        });
    }

    onStart (itemCtrl:GridsterItemComponent) {
        this.draggedElement = itemCtrl.$element;
        itemCtrl.isDragging = true;
        // Create a deep copy of the items; we use them to revert the item
        // positions after each drag change, making an entire drag operation less
        // distructable
        this._items = this.serializeItems();

        // Since dragging actually alters the grid, we need to establish the number
        // of cols (+1 extra) before the drag starts

        this._maxGridCols = this.gridList.grid.length;

        this.highlightPositionForItem(itemCtrl);
    }

    onDrag (itemCtrl:GridsterItemComponent) {
        var newPosition = this.snapItemPositionToGrid(itemCtrl);

        if (this.dragPositionChanged(newPosition)) {
            this.previousDragPosition = newPosition;

            // Regenerate the grid with the positions from when the drag started
            this.restoreCachedItems();
            this.gridList.generateGrid();

            // Since the items list is a deep copy, we need to fetch the item
            // corresponding to this drag action again
            this.gridList.moveItemToPosition(itemCtrl, newPosition);

            // Visually update item positions and highlight shape
            this.applyPositionToItems();
            this.highlightPositionForItem(itemCtrl);
        }
    }

    onStop (itemCtrl:GridsterItemComponent) {
        this.draggedElement = undefined;
        this.updateCachedItems();
        this.previousDragPosition = null;

        // HACK: jQuery.draggable removes this class after the dragstop callback,
        // and we need it removed before the drop, to re-enable CSS transitions

        itemCtrl.isDragging = false;

        this.updateMaxItemSize();
        this.applyPositionToItems();
        this.removePositionHighlight();

        itemCtrl.xChange.emit(itemCtrl.x);
        itemCtrl.yChange.emit(itemCtrl.y);
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
        this.items.forEach((item:GridsterItemComponent, idx:number) => {
            let cachedItem = this._items.filter(cachedItem => {
                return cachedItem.$element === item.$element;
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
        if (this.options.direction === "horizontal") {
            // TODO: get rid of window.getComputedStyle
            this._cellHeight = Math.floor(parseFloat(window.getComputedStyle(this.$element).height) / this.options.lanes);
            this._cellWidth = this._cellHeight * this.options.widthHeightRatio;
        } else {
            // TODO: get rid of window.getComputedStyle
            this._cellWidth = Math.floor(parseFloat(window.getComputedStyle(this.$element).width) / this.options.lanes);
            this._cellHeight = this._cellWidth / this.options.widthHeightRatio;
        }
        if (this.options.heightToFontSizeRatio) {
            this._fontSize = this._cellHeight * this.options.heightToFontSizeRatio;
        }
    }

    private applySizeToItems () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].$element.style.width = this.getItemWidth(this.items[i]) + 'px';
            this.items[i].$element.style.height = this.getItemHeight(this.items[i]) + 'px';

            if (this.options.heightToFontSizeRatio) {
                this.items[i].$element.style['font-size'] = this._fontSize;
            }
        }
    }

    private getItemWidth (item) {
        return item.w * this._cellWidth;
    }

    private getItemHeight (item) {
        return item.h * this._cellHeight;
    }

    private applyPositionToItems () {
        // TODO: Implement group separators
        for (var i = 0; i < this.items.length; i++) {
            // Don't interfere with the positions of the dragged items
            if(this.isDragging(this.items[i].$element)) {
                continue;
            }
            this.items[i].$element.style.left = (this.items[i].x * this._cellWidth)+'px';
            this.items[i].$element.style.top = (this.items[i].y * this._cellHeight)+'px';
        }

        let child = <HTMLElement>this.$element.firstChild;
        // Update the width of the entire grid container with enough room on the
        // right to allow dragging items to the end of the grid.
        if (this.options.direction === "horizontal") {
            child.style.height = (this.options.lanes * this._cellHeight)+'px';
            child.style.width = ((this.gridList.grid.length + this.maxItemWidth) * this._cellWidth)+'px';

        } else {
            child.style.height = ((this.gridList.grid.length + this.maxItemHeight) * this._cellHeight)+'px';
            child.style.width = (this.options.lanes * this._cellWidth)+'px';
        }
    }

    private isDragging (element) {
        if(!this.draggedElement) {
            return false;
        }
        return element === this.draggedElement;
    }

    public getItemByElement (element) {
        // XXX: this could be optimized by storing the item reference inside the
        // meta data of the DOM element
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].$element === element) {
                return this.items[i];
            }
        }
    }

    private snapItemPositionToGrid (item) {
        var position = {
            left: item.$element.offsetLeft,
            top: item.$element.offsetTop
        };

        position[0] -= this.$element.offsetLeft;

        var col = Math.round(position.left / this._cellWidth),
            row = Math.round(position.top / this._cellHeight);

        // Keep item position within the grid and don't let the item create more
        // than one extra column
        col = Math.max(col, 0);
        row = Math.max(row, 0);

        if (this.options.direction === "horizontal") {
            col = Math.min(col, this._maxGridCols);
            row = Math.min(row, this.options.lanes - item.h);
        } else {
            col = Math.min(col, this.options.lanes - item.w);
            row = Math.min(row, this._maxGridCols);
        }

        return [col, row];
    }

    private dragPositionChanged (newPosition) {
        if (!this.previousDragPosition) {
            return true;
        }
        return (newPosition[0] != this.previousDragPosition[0] ||
        newPosition[1] != this.previousDragPosition[1]);
    }

    private highlightPositionForItem (item) {
        this.$positionHighlight.style.width = this.getItemWidth(item)+'px';
        this.$positionHighlight.style.height = this.getItemHeight(item)+'px';
        this.$positionHighlight.style.left = item.x * this._cellWidth+'px';
        this.$positionHighlight.style.top = item.y * this._cellHeight+'px';
        this.$positionHighlight.style.display = '';

        if (this.options.heightToFontSizeRatio) {
            this.$positionHighlight.style['font-size'] = this._fontSize;
        }
    }

    public updateCachedItems () {
        // Notify the user with the items that changed since the previous snapshot
        this.triggerOnChange();
        this._items = this.serializeItems();
    }

    private triggerOnChange () {
        let itmsChanged = this.gridList.getChangedItems(this._items, '$element');
        if(itmsChanged.length > 0){
            this.gridsterChange.emit(itmsChanged);
            if (typeof (this.options.onChange) != 'function') {
                return;
            }
            this.options.onChange.call(
                this, itmsChanged
            );
        }
    }

    private removePositionHighlight () {
        this.$positionHighlight.style.display = 'none';
    }

}
