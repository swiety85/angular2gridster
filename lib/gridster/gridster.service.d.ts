/// <reference types="core-js" />
import { GridList, IGridListItem } from './gridList/gridList';
export interface IGridsterDraggableOptions {
    handlerClass?: string;
    zIndex?: number;
    scroll?: boolean;
    containment?: string;
}
export interface IGridsterOptions {
    direction?: string;
    lanes?: number;
    widthHeightRatio?: number;
    heightToFontSizeRatio?: number;
    onChange?: Function;
    dragAndDrop?: boolean;
    itemSelector?: string;
}
export declare class GridsterService {
    $element: HTMLElement;
    gridList: GridList;
    items: Array<IGridListItem>;
    _items: Array<IGridListItem>;
    options: IGridsterOptions;
    draggableOptions: IGridsterDraggableOptions;
    draggableDefaults: IGridsterDraggableOptions;
    defaults: IGridsterOptions;
    private maxItemWidth;
    private maxItemHeight;
    $positionHighlight: HTMLElement;
    private previousDragPosition;
    private draggedElement;
    private _maxGridCols;
    private _cellWidth;
    private _cellHeight;
    private _fontSize;
    constructor();
    /**
     * Must be called before init
     * @param item
     */
    registerItem(item: IGridListItem): void;
    init(options?: IGridsterOptions, draggableOptions?: IGridsterDraggableOptions): void;
    start(gridsterEl: HTMLElement): void;
    render(): void;
    reflow(): void;
    private initGridList();
    private calculateCellSize();
    private applySizeToItems();
    private getItemWidth(item);
    private getItemHeight(item);
    private applyPositionToItems();
    private isDragging(element);
    onStart(itemCtrl: any): void;
    onDrag(itemCtrl: any): void;
    onStop(itemCtrl: any): void;
    private createGridSnapshot();
    private getItemByElement(element);
    private snapItemPositionToGrid(item);
    private dragPositionChanged(newPosition);
    private highlightPositionForItem(item);
    private updateGridSnapshot();
    private triggerOnChange();
    private removePositionHighlight();
}
