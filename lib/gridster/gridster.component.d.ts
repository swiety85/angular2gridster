import { OnInit, ElementRef } from '@angular/core';
import { GridsterService, IGridsterOptions } from './gridster.service';
export declare class GridsterComponent implements OnInit {
    options: IGridsterOptions;
    $positionHighlight: any;
    gridster: GridsterService;
    $el: HTMLElement;
    constructor(elementRef: ElementRef, gridster: GridsterService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
