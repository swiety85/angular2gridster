export interface IGridsterOptions {
    direction?: string;
    lanes?: number;
    widthHeightRatio?: number;
    heightToFontSizeRatio?: number;
    dragAndDrop?: boolean;
    resizable?: boolean;
    resizeHandles?: {
        s?: boolean;
        e?: boolean;
        n?: boolean;
        w?: boolean;
        se?: boolean;
        ne?: boolean;
        sw?: boolean;
        nw?: boolean;
    };
    connectWith?: string;
    shrink?: boolean;
    floating?: boolean;
    responsiveView?: boolean;
    responsiveDebounce?: number;
    responsiveSizes?: boolean;
    lines?: {
        visible?: boolean;
        color?: string;
        backgroundColor?: string;
        width?: number;
        always?: boolean;
    };
    breakpoint?: string;
    minWidth?: number;
    useCSSTransforms?: boolean;
    cellHeight?: number;
    cellWidth?: number;
    tolerance?: string;
    responsiveOptions?: Array<IGridsterOptions>;
    appendToBody?: boolean;
}
