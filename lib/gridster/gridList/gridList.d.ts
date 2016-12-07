/// <reference types="core-js" />
export interface IGridListItem {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    autoSize?: Boolean;
    $element?: HTMLElement;
}
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
export declare class GridList {
    private options;
    private defaults;
    items: Array<IGridListItem>;
    grid: Array<Array<IGridListItem>>;
    constructor(items: Array<IGridListItem>, options: {
        direction: string;
        lanes: number;
    });
    /**
     * Clone items with a deep level of one. Items are not referenced but their
     * properties are
     */
    static cloneItems(items: Array<IGridListItem>, _items?: Array<IGridListItem>): IGridListItem[];
    /**
     * Illustates grid as text-based table, using a number identifier for each
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
    toString(): string;
    /**
     * Build the grid structure from scratch, with the current item positions
     */
    generateGrid(): void;
    resizeGrid(lanes: number): void;
    /**
     * This method has two options for the position we want for the item:
     * - Starting from a certain row/column number and only looking for
     *   positions to its right
     * - Accepting positions for a certain row number only (use-case: items
     *   being shifted to the left/right as a result of collisions)
     *
     * @param {Object} item
     * @param {Object} start Position from which to start
     *     the search.
     * @param {number} [fixedRow] If provided, we're going to try to find a
     *     position for the new item on it. If doesn't fit there, we're going
     *     to put it on the first row.
     *
     * @returns {Array} x and y.
     */
    findPositionForItem(item: IGridListItem, start: {
        x: number;
        y: number;
    }, fixedRow?: number): any;
    moveItemToPosition(item: IGridListItem, newPosition: Array<number>): void;
    /**
     * Resize an item and resolve collisions.
     *
     * @param {Object} item A reference to an item that's part of the grid.
     * @param {Object} size
     * @param {number} [size.w=item.w] The new width.
     * @param {number} [size.h=item.h] The new height.
     */
    resizeItem(item: IGridListItem, size: {
        w: number;
        h: number;
    }): void;
    /**
     * Compare the current items against a previous snapshot and return only
     * the ones that changed their attributes in the meantime. This includes both
     * position (x, y) and size (w, h)
     *
     * Since both their position and size can change, the items need an
     * additional identifier attribute to match them with their previous state
     */
    getChangedItems(initialItems: Array<IGridListItem>, idAttribute: string): any[];
    private sortItemsByPosition();
    /**
     * Some items can have 100% height or 100% width. Those dimmensions are
     * expressed as 0. We need to ensure a valid width and height for each of
     * those items as the number of items per lane.
     */
    private adjustSizeOfItems();
    private resetGrid();
    /**
     * Check that an item wouldn't overlap with another one if placed at a
     * certain position within the grid
     */
    private itemFitsAtPosition(item, newPosition);
    private updateItemPosition(item, position);
    /**
     * @param {Object} item A reference to a grid item.
     * @param {number} width The new width.
     * @param {number} height The new height.
     */
    private updateItemSize(item, width, height);
    /**
     * Mark the grid cells that are occupied by an item. This prevents items
     * from overlapping in the grid
     */
    private markItemPositionToGrid(item);
    private deleteItemPositionFromGrid(item);
    /**
     * Ensure that the grid has at least N columns available.
     */
    private ensureColumns(N);
    private getItemsCollidingWithItem(item);
    private itemsAreColliding(item1, item2);
    private resolveCollisions(item);
    /**
     * Attempt to resolve the collisions after moving a an item over one or more
     * other items within the grid, by shifting the position of the colliding
     * items around the moving one. This might result in subsequent collisions,
     * in which case we will revert all position permutations. To be able to
     * revert to the initial item positions, we create a virtual grid in the
     * process
     */
    private tryToResolveCollisionsLocally(item);
    /**
     * Build the grid from scratch, by using the current item positions and
     * pulling them as much to the left as possible, removing as space between
     * them as possible.
     *
     * If a "fixed item" is provided, its position will be kept intact and the
     * rest of the items will be layed around it.
     */
    private pullItemsToLeft(fixedItem?);
    /**
     * When pulling items to the left, we need to find the leftmost position for
     * an item, with two considerations in mind:
     * - preserving its current row
     * - preserving the previous horizontal order between items
     */
    private findLeftMostPositionForItem(item);
    private getItemByAttribute(key, value);
    private padNumber(nr, prefix);
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
    private getItemPosition(item);
    /**
     * See getItemPosition.
     */
    private setItemPosition(item, position);
}
