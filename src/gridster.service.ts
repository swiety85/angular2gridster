import { GridList, IGridListItem } from './gridList/gridList';

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

    items:Array<IGridListItem> = [];
    _items:Array<IGridListItem>;

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
    registerItem(item:IGridListItem) {
        this.items.push(item);

        return item;

    }

    init (options:IGridsterOptions = {}, draggableOptions:IGridsterDraggableOptions = {}) {

        this.options = (<any>Object).assign({}, this.defaults, options);
        this.draggableOptions = (<any>Object).assign(
            {}, this.draggableDefaults, draggableOptions);


        this.maxItemWidth = Math.max.apply(
            null, this.items.map(function(item) { return item.w; }));
        this.maxItemHeight = Math.max.apply(
            null, this.items.map(function(item) { return item.h; }));
    }

    start (gridsterEl:HTMLElement) {
        this.$element = gridsterEl;
        // Used to highlight a position an element will land on upon drop
        //this.$positionHighlight = this.$element.querySelector('.position-highlight') ?
        //    this.$element.querySelector('.position-highlight')[0]: null;
        if(this.$positionHighlight) {
            this.$positionHighlight.style.display = 'none';
        }

        this.initGridList();
        this.reflow();
    }

    render () {
        this.applySizeToItems();
        this.applyPositionToItems();
    }

    reflow () {
        this.calculateCellSize();
        this.render();
    }

    onStart (itemCtrl) {
        this.draggedElement = itemCtrl.el;
        itemCtrl.el.classList.add('is-dragging');
        // Create a deep copy of the items; we use them to revert the item
        // positions after each drag change, making an entire drag operation less
        // distructable
        this.createGridSnapshot();

        // Since dragging actually alters the grid, we need to establish the number
        // of cols (+1 extra) before the drag starts

        this._maxGridCols = this.gridList.grid.length;

        this.highlightPositionForItem(this.getItemByElement(itemCtrl.el));
    }

    onDrag (itemCtrl) {
        var item = this.getItemByElement(itemCtrl.el),
            newPosition = this.snapItemPositionToGrid(item);

        if (this.dragPositionChanged(newPosition)) {
            this.previousDragPosition = newPosition;

            // Regenerate the grid with the positions from when the drag started
            GridList.cloneItems(this._items, this.items);
            this.gridList.generateGrid();

            // Since the items list is a deep copy, we need to fetch the item
            // corresponding to this drag action again
            item = this.getItemByElement(itemCtrl.el);
            this.gridList.moveItemToPosition(item, newPosition);

            // Visually update item positions and highlight shape
            this.applyPositionToItems();
            this.highlightPositionForItem(item);
        }
    }

    onStop (itemCtrl) {
        this.draggedElement = undefined;
        this.updateGridSnapshot();
        this.previousDragPosition = null;

        // HACK: jQuery.draggable removes this class after the dragstop callback,
        // and we need it removed before the drop, to re-enable CSS transitions

        itemCtrl.el.classList.remove('is-dragging');

        this.applyPositionToItems();
        this.removePositionHighlight();
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
            child.style.width = ((this.gridList.grid.length + this.maxItemWidth) * this._cellWidth)+'px';
        } else {
            child.style.height = ((this.gridList.grid.length + this.maxItemHeight) * this._cellHeight)+'px';
        }
    }

    private isDragging (element) {
        if(!this.draggedElement) {
            return false;
        }
        return element === this.draggedElement;
    }

    public createGridSnapshot () {
        this._items = GridList.cloneItems(this.items);
    }

    private getItemByElement (element) {
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

    public updateGridSnapshot () {
        // Notify the user with the items that changed since the previous snapshot
        this.triggerOnChange();
        GridList.cloneItems(this.items, this._items);
    }

    private triggerOnChange () {
        if (typeof(this.options.onChange) != 'function') {
            return;
        }
        this.options.onChange.call(
            this, this.gridList.getChangedItems(this._items, '$element')
        );
    }

    private removePositionHighlight () {
        this.$positionHighlight.style.display = 'none';
    }

}
