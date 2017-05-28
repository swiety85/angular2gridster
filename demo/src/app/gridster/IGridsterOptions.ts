export interface IGridsterOptions {
    direction?: string;
    lanes?: number;
    widthHeightRatio?: number;
    heightToFontSizeRatio?: number;
    dragAndDrop?: boolean;
    itemSelector?: string;
    resizable?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    defaultItemWidth?: number;
    defaultItemHeight?: number;
    responsiveView?: boolean;
    responsiveDebounce?: number;
    responsiveOptions?: Array<IGridsterOptions>;
}
