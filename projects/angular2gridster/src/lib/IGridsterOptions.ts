export interface IGridsterOptions {
    direction?: string;
    lanes?: number;
    widthHeightRatio?: number;
    heightToFontSizeRatio?: number;
    dragAndDrop?: boolean;
    itemSelector?: string;
    resizable?: boolean;
    resizeHandles?: IResizeHandles;
    shrink?: boolean;
    floating?: boolean;
    responsiveView?: boolean;
    responsiveDebounce?: number;
    responsiveSizes?: boolean;
    responsiveToParent?: boolean;
    lines?: {
        visible?: boolean,
        color?: string,
        backgroundColor?: string;
        width?: number,
        always?: boolean
    };
    breakpoint?: string;
    minWidth?: number;
    useCSSTransforms?: boolean;
    cellHeight?: number;
    cellWidth?: number;
    tolerance?: string;
    responsiveOptions?: IGridsterOptions[];
}

export interface IResizeHandles {
    s?: boolean,
    e?: boolean,
    n?: boolean,
    w?: boolean,
    se?: boolean,
    ne?: boolean,
    sw?: boolean,
    nw?: boolean
}

export type ResizeHandlesKey = {
	[K in keyof IResizeHandles]:
		IResizeHandles[K] extends number ? K : never;
}[keyof IResizeHandles];

export type GridsterOptionsKey = {
	[K in keyof IGridsterOptions]:
		IGridsterOptions[K] extends number ? K : never;
}[keyof IGridsterOptions];
