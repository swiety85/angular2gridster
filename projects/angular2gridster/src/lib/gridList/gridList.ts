import { GridListItem } from './GridListItem';
import { IGridsterOptions } from '../IGridsterOptions';

const GridCol = function(lanes) {
    for (let i = 0; i < lanes; i++) {
        this.push(null);
    }
};
// Extend the Array prototype
GridCol.prototype = [];

/**
 * A GridList manages the two-dimensional positions from a list of items,
 * within a virtual matrix.
 *
 * The GridList's main function is to convert the item positions from one
 * grid size to another, maintaining as much of their order as possible.
 *
 * The GridList's second function is to handle collisions when moving an item
 * over another.
 *
 * The positioning algorithm places items in columns. Starting from left to
 * right, going through each column top to bottom.
 *
 * The size of an item is expressed using the number of cols and rows it
 * takes up within the grid (w and h)
 *
 * The position of an item is express using the col and row position within
 * the grid (x and y)
 *
 * An item is an object of structure:
 * {
 *   w: 3, h: 1,
 *   x: 0, y: 1
 * }
 */
export class GridList {
    items: Array<GridListItem>;
    grid: Array<Array<GridListItem>>;

    options: IGridsterOptions;

    constructor(items: Array<GridListItem>, options: IGridsterOptions) {
        this.options = options;

        this.items = items;

        this.adjustSizeOfItems();

        this.generateGrid();
    }

    /**
     * Illustrates grid as text-based table, using a number identifier for each
     * item. E.g.
     *
     *  #|  0  1  2  3  4  5  6  7  8  9 10 11 12 13
     *  --------------------------------------------
     *  0| 00 02 03 04 04 06 08 08 08 12 12 13 14 16
     *  1| 01 -- 03 05 05 07 09 10 11 11 -- 13 15 --
     *
     * Warn: Does not work if items don't have a width or height specified
     * besides their position in the grid.
     */
    toString() {
        const widthOfGrid = this.grid.length;
        let output = '\n #|',
            border = '\n --',
            item,
            i,
            j;

        // Render the table header
        for (i = 0; i < widthOfGrid; i++) {
            output += ' ' + this.padNumber(i, ' ');
            border += '---';
        }
        output += border;

        // Render table contents row by row, as we go on the y axis
        for (i = 0; i < this.options.lanes; i++) {
            output += '\n' + this.padNumber(i, ' ') + '|';
            for (j = 0; j < widthOfGrid; j++) {
                output += ' ';
                item = this.grid[j][i];
                output += item ? this.padNumber(this.items.indexOf(item), '0') : '--';
            }
        }
        output += '\n';
        return output;
    }

    setOption(name: string, value: any) {
        this.options[name] = value;
    }

    /**
     * Build the grid structure from scratch, with the current item positions
     */
    generateGrid() {
        let i;
        this.resetGrid();
        for (i = 0; i < this.items.length; i++) {
            this.markItemPositionToGrid(this.items[i]);
        }
    }

    resizeGrid(lanes: number) {
        let currentColumn = 0;

        this.options.lanes = lanes;
        this.adjustSizeOfItems();

        this.sortItemsByPosition();
        this.resetGrid();

        // The items will be sorted based on their index within the this.items array,
        // that is their "1d position"
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i],
                position = this.getItemPosition(item);

            this.updateItemPosition(
                item,
                this.findPositionForItem(item, { x: currentColumn, y: 0 })
            );

            // New items should never be placed to the left of previous items
            currentColumn = Math.max(currentColumn, position.x);
        }

        this.pullItemsToLeft();
    }

    /**
     * This method has two options for the position we want for the item:
     * - Starting from a certain row/column number and only looking for
     *   positions to its right
     * - Accepting positions for a certain row number only (use-case: items
     *   being shifted to the left/right as a result of collisions)
     *
     * @param Object item
     * @param Object start Position from which to start
     *     the search.
     * @param number [fixedRow] If provided, we're going to try to find a
     *     position for the new item on it. If doesn't fit there, we're going
     *     to put it on the first row.
     *
     * @returns Array x and y.
     */
    findPositionForItem(
        item: GridListItem,
        start: { x: number; y: number },
        fixedRow?: number
    ): Array<number> {
        let x, y, position;

        // Start searching for a position from the horizontal position of the
        // rightmost item from the grid
        for (x = start.x; x < this.grid.length; x++) {
            if (fixedRow !== undefined) {
                position = [x, fixedRow];

                if (this.itemFitsAtPosition(item, position)) {
                    return position;
                }
            } else {
                for (y = start.y; y < this.options.lanes; y++) {
                    position = [x, y];

                    if (this.itemFitsAtPosition(item, position)) {
                        return position;
                    }
                }
            }
        }

        // If we've reached this point, we need to start a new column
        const newCol = this.grid.length;
        let newRow = 0;

        if (fixedRow !== undefined && this.itemFitsAtPosition(item, [newCol, fixedRow])) {
            newRow = fixedRow;
        }

        return [newCol, newRow];
    }

    moveAndResize(item: GridListItem, newPosition: Array<number>, size: { w: number; h: number }) {
        const position = this.getItemPosition({
            x: newPosition[0],
            y: newPosition[1],
            w: item.w,
            h: item.h
        });
        const width = size.w || item.w,
            height = size.h || item.h;

        this.updateItemPosition(item, [position.x, position.y]);
        this.updateItemSize(item, width, height);

        this.resolveCollisions(item);
    }

    moveItemToPosition(item: GridListItem, newPosition: Array<number>) {
        const position = this.getItemPosition({
            x: newPosition[0],
            y: newPosition[1],
            w: item.w,
            h: item.h
        });

        this.updateItemPosition(item, [position.x, position.y]);
        this.resolveCollisions(item);
    }

    /**
     * Resize an item and resolve collisions.
     *
     * @param Object item A reference to an item that's part of the grid.
     * @param Object size
     * @param number [size.w=item.w] The new width.
     * @param number [size.h=item.h] The new height.
     */
    resizeItem(item: GridListItem, size: { w: number; h: number }) {
        const width = size.w || item.w,
            height = size.h || item.h;

        this.updateItemSize(item, width, height);

        this.pullItemsToLeft(item);
    }

    /**
     * Compare the current items against a previous snapshot and return only
     * the ones that changed their attributes in the meantime. This includes both
     * position (x, y) and size (w, h)
     *
     * Each item that is returned is not the GridListItem but the helper that holds GridListItem
     * and list of changed properties.
     */
    getChangedItems(
        initialItems: Array<GridListItem>,
        breakpoint?
    ): Array<{
        item: GridListItem;
        changes: Array<string>;
        isNew: boolean;
    }> {
        return this.items
            .map((item: GridListItem) => {
                const changes = [];
                const oldValues: {
                    x?: number;
                    y?: number;
                    w?: number;
                    h?: number;
                } = {};
                const initItem = initialItems.find(initItm => initItm.$element === item.$element);

                if (!initItem) {
                    return { item, changes: ['x', 'y', 'w', 'h'], isNew: true };
                }

                const oldX = initItem.getValueX(breakpoint);
                if (item.getValueX(breakpoint) !== oldX) {
                    changes.push('x');
                    if (oldX || oldX === 0) {
                        oldValues.x = oldX;
                    }
                }

                const oldY = initItem.getValueY(breakpoint);
                if (item.getValueY(breakpoint) !== oldY) {
                    changes.push('y');
                    if (oldY || oldY === 0) {
                        oldValues.y = oldY;
                    }
                }
                if (item.getValueW(breakpoint) !== initItem.getValueW(breakpoint)) {
                    changes.push('w');
                    oldValues.w = initItem.w;
                }
                if (item.getValueH(breakpoint) !== initItem.getValueH(breakpoint)) {
                    changes.push('h');
                    oldValues.h = initItem.h;
                }

                return { item, oldValues, changes, isNew: false };
            })
            .filter((itemChange: { item: GridListItem; changes: Array<string> }) => {
                return itemChange.changes.length;
            });
    }

    resolveCollisions(item: GridListItem) {
        if (!this.tryToResolveCollisionsLocally(item)) {
            this.pullItemsToLeft(item);
        }
        if (this.options.floating) {
            this.pullItemsToLeft();
        } else if (this.getItemsCollidingWithItem(item).length) {
            this.pullItemsToLeft();
        }
    }

    pushCollidingItems(fixedItem?: GridListItem) {
        // Start a fresh grid with the fixed item already placed inside
        this.sortItemsByPosition();
        this.resetGrid();
        this.generateGrid();

        this.items
            .filter(item => !this.isItemFloating(item) && item !== fixedItem)
            .forEach(item => {
                if (!this.tryToResolveCollisionsLocally(item)) {
                    this.pullItemsToLeft(item);
                }
            });
    }

    /**
     * Build the grid from scratch, by using the current item positions and
     * pulling them as much to the left as possible, removing as space between
     * them as possible.
     *
     * If a "fixed item" is provided, its position will be kept intact and the
     * rest of the items will be layed around it.
     */
    pullItemsToLeft(fixedItem?) {
        if (this.options.direction === 'none') {
            return;
        }

        // Start a fresh grid with the fixed item already placed inside
        this.sortItemsByPosition();
        this.resetGrid();

        // Start the grid with the fixed item as the first positioned item
        if (fixedItem) {
            const fixedPosition = this.getItemPosition(fixedItem);
            this.updateItemPosition(fixedItem, [fixedPosition.x, fixedPosition.y]);
        }

        this.items
            .filter((item: GridListItem) => {
                return !item.dragAndDrop && item !== fixedItem;
            })
            .forEach((item: GridListItem) => {
                const fixedPosition = this.getItemPosition(item);
                this.updateItemPosition(item, [fixedPosition.x, fixedPosition.y]);
            });

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i],
                position = this.getItemPosition(item);

            // The fixed item keeps its exact position
            if (
                (fixedItem && item === fixedItem) ||
                !item.dragAndDrop ||
                (!this.options.floating &&
                    this.isItemFloating(item) &&
                    !this.getItemsCollidingWithItem(item).length)
            ) {
                continue;
            }

            const x = this.findLeftMostPositionForItem(item),
                newPosition = this.findPositionForItem(item, { x: x, y: 0 }, position.y);

            this.updateItemPosition(item, newPosition);
        }
    }

    isOverFixedArea(
        x: number,
        y: number,
        w: number,
        h: number,
        item: GridListItem = null
    ): boolean {
        let itemData = { x, y, w, h };

        if (this.options.direction !== 'horizontal') {
            itemData = { x: y, y: x, w: h, h: w };
        }

        for (let i = itemData.x; i < itemData.x + itemData.w; i++) {
            for (let j = itemData.y; j < itemData.y + itemData.h; j++) {
                if (
                    this.grid[i] &&
                    this.grid[i][j] &&
                    this.grid[i][j] !== item &&
                    !this.grid[i][j].dragAndDrop
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    checkItemAboveEmptyArea(item: GridListItem, newPosition: { x: number; y: number }) {
        let itemData = {
            x: newPosition.x,
            y: newPosition.y,
            w: item.w,
            h: item.h
        };
        if (!item.itemPrototype && item.x === newPosition.x && item.y === newPosition.y) {
            return true;
        }

        if (this.options.direction === 'horizontal') {
            itemData = {
                x: newPosition.y,
                y: newPosition.x,
                w: itemData.h,
                h: itemData.w
            };
        }
        return !this.checkItemsInArea(
            itemData.y,
            itemData.y + itemData.h - 1,
            itemData.x,
            itemData.x + itemData.w - 1,
            item
        );
    }

    fixItemsPositions(options: IGridsterOptions) {
        // items with x, y that fits gird with size of options.lanes
        const validItems = this.items
            .filter((item: GridListItem) => item.itemComponent)
            .filter((item: GridListItem) => this.isItemValidForGrid(item, options));
        // items that x, y must be generated
        const invalidItems = this.items
            .filter((item: GridListItem) => item.itemComponent)
            .filter((item: GridListItem) => !this.isItemValidForGrid(item, options));

        const gridList = new GridList([], options);

        // put items with defined positions to the grid
        gridList.items = validItems.map((item: GridListItem) => {
            return item.copyForBreakpoint(options.breakpoint);
        });

        gridList.generateGrid();

        invalidItems.forEach(item => {
            // TODO: check if this change does not broke anything
            // const itemCopy = item.copy();
            const itemCopy = item.copyForBreakpoint(options.breakpoint);
            const position = gridList.findPositionForItem(itemCopy, {
                x: 0,
                y: 0
            });

            gridList.items.push(itemCopy);
            gridList.setItemPosition(itemCopy, position);
            gridList.markItemPositionToGrid(itemCopy);
        });

        gridList.pullItemsToLeft();
        gridList.pushCollidingItems();

        this.items.forEach((itm: GridListItem) => {
            const cachedItem = gridList.items.filter(cachedItm => {
                return cachedItm.$element === itm.$element;
            })[0];

            itm.setValueX(cachedItem.x, options.breakpoint);
            itm.setValueY(cachedItem.y, options.breakpoint);
            itm.setValueW(cachedItem.w, options.breakpoint);
            itm.setValueH(cachedItem.h, options.breakpoint);
            itm.autoSize = cachedItem.autoSize;
        });
    }

    deleteItemPositionFromGrid(item: GridListItem) {
        const position = this.getItemPosition(item);
        let x, y;

        for (x = position.x; x < position.x + position.w; x++) {
            // It can happen to try to remove an item from a position not generated
            // in the grid, probably when loading a persisted grid of items. No need
            // to create a column to be able to remove something from it, though
            if (!this.grid[x]) {
                continue;
            }

            for (y = position.y; y < position.y + position.h; y++) {
                // Don't clear the cell if it's been occupied by a different widget in
                // the meantime (e.g. when an item has been moved over this one, and
                // thus by continuing to clear this item's previous position you would
                // cancel the first item's move, leaving it without any position even)
                if (this.grid[x][y] === item) {
                    this.grid[x][y] = null;
                }
            }
        }
    }

    private isItemFloating(item) {
        if (item.itemComponent && item.itemComponent.isDragging) {
            return false;
        }
        const position = this.getItemPosition(item);

        if (position.x === 0) {
            return false;
        }
        const rowBelowItem = this.grid[position.x - 1];

        return (rowBelowItem || [])
            .slice(position.y, position.y + position.h)
            .reduce((isFloating, cellItem) => {
                return isFloating && !cellItem;
            }, true);
    }

    private isItemValidForGrid(item: GridListItem, options: IGridsterOptions) {
        const itemData =
            options.direction === 'horizontal'
                ? {
                      x: item.getValueY(options.breakpoint),
                      y: item.getValueX(options.breakpoint),
                      w: item.getValueH(options.breakpoint),
                      h: Math.min(item.getValueW(this.options.breakpoint), options.lanes)
                  }
                : {
                      x: item.getValueX(options.breakpoint),
                      y: item.getValueY(options.breakpoint),
                      w: Math.min(item.getValueW(this.options.breakpoint), options.lanes),
                      h: item.getValueH(options.breakpoint)
                  };

        return (
            typeof itemData.x === 'number' &&
            typeof itemData.y === 'number' &&
            itemData.x + itemData.w <= options.lanes
        );
    }

    private findDefaultPositionHorizontal(width: number, height: number) {
        for (const col of this.grid) {
            const colIdx = this.grid.indexOf(col);
            let rowIdx = 0;
            while (rowIdx < col.length - height + 1) {
                if (
                    !this.checkItemsInArea(colIdx, colIdx + width - 1, rowIdx, rowIdx + height - 1)
                ) {
                    return [colIdx, rowIdx];
                }
                rowIdx++;
            }
        }
        return [this.grid.length, 0];
    }

    private findDefaultPositionVertical(width: number, height: number) {
        for (const row of this.grid) {
            const rowIdx = this.grid.indexOf(row);
            let colIdx = 0;
            while (colIdx < row.length - width + 1) {
                if (
                    !this.checkItemsInArea(rowIdx, rowIdx + height - 1, colIdx, colIdx + width - 1)
                ) {
                    return [colIdx, rowIdx];
                }
                colIdx++;
            }
        }
        return [0, this.grid.length];
    }

    private checkItemsInArea(
        rowStart: number,
        rowEnd: number,
        colStart: number,
        colEnd: number,
        item?: GridListItem
    ) {
        for (let i = rowStart; i <= rowEnd; i++) {
            for (let j = colStart; j <= colEnd; j++) {
                if (this.grid[i] && this.grid[i][j] && (item ? this.grid[i][j] !== item : true)) {
                    return true;
                }
            }
        }
        return false;
    }

    private sortItemsByPosition() {
        this.items.sort((item1, item2) => {
            const position1 = this.getItemPosition(item1),
                position2 = this.getItemPosition(item2);

            // Try to preserve columns.
            if (position1.x !== position2.x) {
                return position1.x - position2.x;
            }

            if (position1.y !== position2.y) {
                return position1.y - position2.y;
            }

            // The items are placed on the same position.
            return 0;
        });
    }

    /**
     * Some items can have 100% height or 100% width. Those dimmensions are
     * expressed as 0. We need to ensure a valid width and height for each of
     * those items as the number of items per lane.
     */
    private adjustSizeOfItems() {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            // This can happen only the first time items are checked.
            // We need the property to have a value for all the items so that the
            // `cloneItems` method will merge the properties properly. If we only set
            // it to the items that need it then the following can happen:
            //
            // cloneItems([{id: 1, autoSize: true}, {id: 2}],
            //            [{id: 2}, {id: 1, autoSize: true}]);
            //
            // will result in
            //
            // [{id: 1, autoSize: true}, {id: 2, autoSize: true}]
            if (item.autoSize === undefined) {
                item.autoSize = item.w === 0 || item.h === 0;
            }

            if (item.autoSize) {
                if (this.options.direction === 'horizontal') {
                    item.h = this.options.lanes;
                } else {
                    item.w = this.options.lanes;
                }
            }
        }
    }

    private resetGrid() {
        this.grid = [];
    }

    /**
     * Check that an item wouldn't overlap with another one if placed at a
     * certain position within the grid
     */
    private itemFitsAtPosition(item: GridListItem, newPosition) {
        const position = this.getItemPosition(item);
        let x, y;

        // No coordonate can be negative
        if (newPosition[0] < 0 || newPosition[1] < 0) {
            return false;
        }

        // Make sure the item isn't larger than the entire grid
        if (newPosition[1] + Math.min(position.h, this.options.lanes) > this.options.lanes) {
            return false;
        }

        if (this.isOverFixedArea(item.x, item.y, item.w, item.h)) {
            return false;
        }

        // Make sure the position doesn't overlap with an already positioned
        // item.
        for (x = newPosition[0]; x < newPosition[0] + position.w; x++) {
            const col = this.grid[x];
            // Surely a column that hasn't even been created yet is available
            if (!col) {
                continue;
            }

            for (y = newPosition[1]; y < newPosition[1] + position.h; y++) {
                // Any space occupied by an item can continue to be occupied by the
                // same item.
                if (col[y] && col[y] !== item) {
                    return false;
                }
            }
        }

        return true;
    }

    private updateItemPosition(item: GridListItem, position: Array<any>) {
        if (item.x !== null && item.y !== null) {
            this.deleteItemPositionFromGrid(item);
        }

        this.setItemPosition(item, position);

        this.markItemPositionToGrid(item);
    }

    /**
     * @param Object item A reference to a grid item.
     * @param number width The new width.
     * @param number height The new height.
     */
    private updateItemSize(item: GridListItem, width, height) {
        if (item.x !== null && item.y !== null) {
            this.deleteItemPositionFromGrid(item);
        }

        item.w = width;
        item.h = height;

        this.markItemPositionToGrid(item);
    }

    /**
     * Mark the grid cells that are occupied by an item. This prevents items
     * from overlapping in the grid
     */
    private markItemPositionToGrid(item: GridListItem) {
        const position = this.getItemPosition(item);
        let x, y;

        // Ensure that the grid has enough columns to accomodate the current item.
        this.ensureColumns(position.x + position.w);

        for (x = position.x; x < position.x + position.w; x++) {
            for (y = position.y; y < position.y + position.h; y++) {
                this.grid[x][y] = item;
            }
        }
    }

    /**
     * Ensure that the grid has at least N columns available.
     */
    private ensureColumns(N) {
        for (let i = 0; i < N; i++) {
            if (!this.grid[i]) {
                this.grid.push(new GridCol(this.options.lanes));
            }
        }
    }

    private getItemsCollidingWithItem(item: GridListItem): number[] {
        const collidingItems = [];
        for (let i = 0; i < this.items.length; i++) {
            if (item !== this.items[i] && this.itemsAreColliding(item, this.items[i])) {
                collidingItems.push(i);
            }
        }
        return collidingItems;
    }

    private itemsAreColliding(item1: GridListItem, item2: GridListItem) {
        const position1 = this.getItemPosition(item1),
            position2 = this.getItemPosition(item2);

        return !(
            position2.x >= position1.x + position1.w ||
            position2.x + position2.w <= position1.x ||
            position2.y >= position1.y + position1.h ||
            position2.y + position2.h <= position1.y
        );
    }

    /**
     * Attempt to resolve the collisions after moving an item over one or more
     * other items within the grid, by shifting the position of the colliding
     * items around the moving one. This might result in subsequent collisions,
     * in which case we will revert all position permutations. To be able to
     * revert to the initial item positions, we create a virtual grid in the
     * process
     */
    private tryToResolveCollisionsLocally(item: GridListItem) {
        const collidingItems = this.getItemsCollidingWithItem(item);
        if (!collidingItems.length) {
            return true;
        }

        const _gridList = new GridList(
            this.items.map(itm => {
                return itm.copy();
            }),
            this.options
        );

        let leftOfItem;
        let rightOfItem;
        let aboveOfItem;
        let belowOfItem;

        for (let i = 0; i < collidingItems.length; i++) {
            const collidingItem = _gridList.items[collidingItems[i]],
                collidingPosition = this.getItemPosition(collidingItem);

            // We use a simple algorithm for moving items around when collisions occur:
            // In this prioritized order, we try to move a colliding item around the
            // moving one:
            // 1. to its left side
            // 2. above it
            // 3. under it
            // 4. to its right side
            const position = this.getItemPosition(item);

            leftOfItem = [position.x - collidingPosition.w, collidingPosition.y];
            rightOfItem = [position.x + position.w, collidingPosition.y];
            aboveOfItem = [collidingPosition.x, position.y - collidingPosition.h];
            belowOfItem = [collidingPosition.x, position.y + position.h];

            if (_gridList.itemFitsAtPosition(collidingItem, leftOfItem)) {
                _gridList.updateItemPosition(collidingItem, leftOfItem);
            } else if (_gridList.itemFitsAtPosition(collidingItem, aboveOfItem)) {
                _gridList.updateItemPosition(collidingItem, aboveOfItem);
            } else if (_gridList.itemFitsAtPosition(collidingItem, belowOfItem)) {
                _gridList.updateItemPosition(collidingItem, belowOfItem);
            } else if (_gridList.itemFitsAtPosition(collidingItem, rightOfItem)) {
                _gridList.updateItemPosition(collidingItem, rightOfItem);
            } else {
                // Collisions failed, we must use the pullItemsToLeft method to arrange
                // the other items around this item with fixed position. This is our
                // plan B for when local collision resolving fails.
                return false;
            }
        }
        // If we reached this point it means we managed to resolve the collisions
        // from one single iteration, just by moving the colliding items around. So
        // we accept this scenario and merge the branched-out grid instance into the
        // original one

        this.items.forEach((itm: GridListItem, idx: number) => {
            const cachedItem = _gridList.items.filter(cachedItm => {
                return cachedItm.$element === itm.$element;
            })[0];

            itm.x = cachedItem.x;
            itm.y = cachedItem.y;
            itm.w = cachedItem.w;
            itm.h = cachedItem.h;
            itm.autoSize = cachedItem.autoSize;
        });
        this.generateGrid();
        return true;
    }

    /**
     * When pulling items to the left, we need to find the leftmost position for
     * an item, with two considerations in mind:
     * - preserving its current row
     * - preserving the previous horizontal order between items
     */
    private findLeftMostPositionForItem(item) {
        let tail = 0;
        const position = this.getItemPosition(item);

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = position.y; j < position.y + position.h; j++) {
                const otherItem = this.grid[i][j];

                if (!otherItem) {
                    continue;
                }

                const otherPosition = this.getItemPosition(otherItem);

                if (this.items.indexOf(otherItem) < this.items.indexOf(item)) {
                    tail = otherPosition.x + otherPosition.w;
                }
            }
        }

        return tail;
    }

    private findItemByPosition(x: number, y: number): GridListItem {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].x === x && this.items[i].y === y) {
                return this.items[i];
            }
        }
    }

    private getItemByAttribute(key, value) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i][key] === value) {
                return this.items[i];
            }
        }
        return null;
    }

    private padNumber(nr, prefix) {
        // Currently works for 2-digit numbers (<100)
        return nr >= 10 ? nr : prefix + nr;
    }

    /**
     * If the direction is vertical we need to rotate the grid 90 deg to the
     * left. Thus, we simulate the fact that items are being pulled to the top.
     *
     * Since the items have widths and heights, if we apply the classic
     * counter-clockwise 90 deg rotation
     *
     *     [0 -1]
     *     [1  0]
     *
     * then the top left point of an item will become the bottom left point of
     * the rotated item. To adjust for this, we need to subtract from the y
     * position the height of the original item - the width of the rotated item.
     *
     * However, if we do this then we'll reverse some actions: resizing the
     * width of an item will stretch the item to the left instead of to the
     * right; resizing an item that doesn't fit into the grid will push the
     * items around it instead of going on a new row, etc.
     *
     * We found it better to do a vertical flip of the grid after rotating it.
     * This restores the direction of the actions and greatly simplifies the
     * transformations.
     */
    private getItemPosition(item: any) {
        if (this.options.direction === 'horizontal') {
            return item;
        } else {
            return {
                x: item.y,
                y: item.x,
                w: item.h,
                h: item.w
            };
        }
    }

    /**
     * See getItemPosition.
     */
    private setItemPosition(item, position) {
        if (this.options.direction === 'horizontal') {
            item.x = position[0];
            item.y = position[1];
        } else {
            // We're supposed to subtract the rotated item's height which is actually
            // the non-rotated item's width.
            item.x = position[1];
            item.y = position[0];
        }
    }
}
