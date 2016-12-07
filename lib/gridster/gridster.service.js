"use strict";
var gridList_1 = require('./gridList/gridList');
var GridsterService = (function () {
    function GridsterService() {
        this.items = [];
        this.draggableDefaults = {
            zIndex: 2,
            scroll: false,
            containment: "parent"
        };
        this.defaults = {
            lanes: 5,
            direction: "horizontal",
            itemSelector: 'li[data-w]',
            widthHeightRatio: 1,
            dragAndDrop: true
        };
    }
    /**
     * Must be called before init
     * @param item
     */
    GridsterService.prototype.registerItem = function (item) {
        this.items.push(item);
    };
    GridsterService.prototype.init = function (options, draggableOptions) {
        if (options === void 0) { options = {}; }
        if (draggableOptions === void 0) { draggableOptions = {}; }
        this.options = Object.assign({}, this.defaults, options);
        this.draggableOptions = Object.assign({}, this.draggableDefaults, draggableOptions);
        this.maxItemWidth = Math.max.apply(null, this.items.map(function (item) { return item.w; }));
        this.maxItemHeight = Math.max.apply(null, this.items.map(function (item) { return item.h; }));
    };
    GridsterService.prototype.start = function (gridsterEl) {
        this.$element = gridsterEl;
        // Used to highlight a position an element will land on upon drop
        //this.$positionHighlight = this.$element.querySelector('.position-highlight') ?
        //    this.$element.querySelector('.position-highlight')[0]: null;
        if (this.$positionHighlight) {
            this.$positionHighlight.style.display = 'none';
        }
        this.initGridList();
        this.reflow();
    };
    GridsterService.prototype.render = function () {
        this.applySizeToItems();
        this.applyPositionToItems();
    };
    GridsterService.prototype.reflow = function () {
        this.calculateCellSize();
        this.render();
    };
    GridsterService.prototype.initGridList = function () {
        // Create instance of GridList (decoupled lib for handling the grid
        // positioning and sorting post-drag and dropping)
        this.gridList = new gridList_1.GridList(this.items, {
            lanes: this.options.lanes,
            direction: this.options.direction
        });
    };
    GridsterService.prototype.calculateCellSize = function () {
        if (this.options.direction === "horizontal") {
            // TODO: get rid of window.getComputedStyle
            this._cellHeight = Math.floor(parseFloat(window.getComputedStyle(this.$element).height) / this.options.lanes);
            this._cellWidth = this._cellHeight * this.options.widthHeightRatio;
        }
        else {
            // TODO: get rid of window.getComputedStyle
            this._cellWidth = Math.floor(parseFloat(window.getComputedStyle(this.$element).width) / this.options.lanes);
            this._cellHeight = this._cellWidth / this.options.widthHeightRatio;
        }
        if (this.options.heightToFontSizeRatio) {
            this._fontSize = this._cellHeight * this.options.heightToFontSizeRatio;
        }
    };
    GridsterService.prototype.applySizeToItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].$element.style.width = this.getItemWidth(this.items[i]) + 'px';
            this.items[i].$element.style.height = this.getItemHeight(this.items[i]) + 'px';
            if (this.options.heightToFontSizeRatio) {
                this.items[i].$element.style['font-size'] = this._fontSize;
            }
        }
    };
    GridsterService.prototype.getItemWidth = function (item) {
        return item.w * this._cellWidth;
    };
    GridsterService.prototype.getItemHeight = function (item) {
        return item.h * this._cellHeight;
    };
    GridsterService.prototype.applyPositionToItems = function () {
        // TODO: Implement group separators
        for (var i = 0; i < this.items.length; i++) {
            // Don't interfere with the positions of the dragged items
            if (this.isDragging(this.items[i].$element)) {
                continue;
            }
            this.items[i].$element.style.left = (this.items[i].x * this._cellWidth) + 'px';
            this.items[i].$element.style.top = (this.items[i].y * this._cellHeight) + 'px';
        }
        var child = this.$element.firstChild;
        // Update the width of the entire grid container with enough room on the
        // right to allow dragging items to the end of the grid.
        if (this.options.direction === "horizontal") {
            child.style.width = ((this.gridList.grid.length + this.maxItemWidth) * this._cellWidth) + 'px';
        }
        else {
            child.style.height = ((this.gridList.grid.length + this.maxItemHeight) * this._cellHeight) + 'px';
        }
    };
    GridsterService.prototype.isDragging = function (element) {
        if (!this.draggedElement) {
            return false;
        }
        return element === this.draggedElement;
    };
    GridsterService.prototype.onStart = function (itemCtrl) {
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
    };
    GridsterService.prototype.onDrag = function (itemCtrl) {
        var item = this.getItemByElement(itemCtrl.el), newPosition = this.snapItemPositionToGrid(item);
        if (this.dragPositionChanged(newPosition)) {
            this.previousDragPosition = newPosition;
            // Regenerate the grid with the positions from when the drag started
            gridList_1.GridList.cloneItems(this._items, this.items);
            this.gridList.generateGrid();
            // Since the items list is a deep copy, we need to fetch the item
            // corresponding to this drag action again
            item = this.getItemByElement(itemCtrl.el);
            this.gridList.moveItemToPosition(item, newPosition);
            // Visually update item positions and highlight shape
            this.applyPositionToItems();
            this.highlightPositionForItem(item);
        }
    };
    GridsterService.prototype.onStop = function (itemCtrl) {
        this.draggedElement = undefined;
        this.updateGridSnapshot();
        this.previousDragPosition = null;
        // HACK: jQuery.draggable removes this class after the dragstop callback,
        // and we need it removed before the drop, to re-enable CSS transitions
        itemCtrl.el.classList.remove('is-dragging');
        this.applyPositionToItems();
        this.removePositionHighlight();
    };
    GridsterService.prototype.createGridSnapshot = function () {
        this._items = gridList_1.GridList.cloneItems(this.items);
    };
    GridsterService.prototype.getItemByElement = function (element) {
        // XXX: this could be optimized by storing the item reference inside the
        // meta data of the DOM element
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].$element === element) {
                return this.items[i];
            }
        }
    };
    GridsterService.prototype.snapItemPositionToGrid = function (item) {
        var position = {
            left: item.$element.offsetLeft,
            top: item.$element.offsetTop
        };
        position[0] -= this.$element.offsetLeft;
        var col = Math.round(position.left / this._cellWidth), row = Math.round(position.top / this._cellHeight);
        // Keep item position within the grid and don't let the item create more
        // than one extra column
        col = Math.max(col, 0);
        row = Math.max(row, 0);
        if (this.options.direction === "horizontal") {
            col = Math.min(col, this._maxGridCols);
            row = Math.min(row, this.options.lanes - item.h);
        }
        else {
            col = Math.min(col, this.options.lanes - item.w);
            row = Math.min(row, this._maxGridCols);
        }
        return [col, row];
    };
    GridsterService.prototype.dragPositionChanged = function (newPosition) {
        if (!this.previousDragPosition) {
            return true;
        }
        return (newPosition[0] != this.previousDragPosition[0] ||
            newPosition[1] != this.previousDragPosition[1]);
    };
    GridsterService.prototype.highlightPositionForItem = function (item) {
        this.$positionHighlight.style.width = this.getItemWidth(item) + 'px';
        this.$positionHighlight.style.height = this.getItemHeight(item) + 'px';
        this.$positionHighlight.style.left = item.x * this._cellWidth + 'px';
        this.$positionHighlight.style.top = item.y * this._cellHeight + 'px';
        this.$positionHighlight.style.display = '';
        if (this.options.heightToFontSizeRatio) {
            this.$positionHighlight.style['font-size'] = this._fontSize;
        }
    };
    GridsterService.prototype.updateGridSnapshot = function () {
        // Notify the user with the items that changed since the previous snapshot
        this.triggerOnChange();
        gridList_1.GridList.cloneItems(this.items, this._items);
    };
    GridsterService.prototype.triggerOnChange = function () {
        if (typeof (this.options.onChange) != 'function') {
            return;
        }
        this.options.onChange.call(this, this.gridList.getChangedItems(this._items, '$element'));
    };
    GridsterService.prototype.removePositionHighlight = function () {
        this.$positionHighlight.style.display = 'none';
    };
    return GridsterService;
}());
exports.GridsterService = GridsterService;
//# sourceMappingURL=gridster.service.js.map