import { Observable, of, fromEvent, pipe, merge } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

import { IGridsterOptions } from './IGridsterOptions';

export class GridsterOptions {
    direction: string;
    lanes: number;
    widthHeightRatio: number;
    heightToFontSizeRatio: number;
    responsiveView: boolean;
    responsiveSizes: boolean;
    dragAndDrop: boolean;
    resizable: boolean;
    shrink: boolean;
    minWidth: number;
    useCSSTransforms: boolean;

    defaults: IGridsterOptions = {
        lanes: 5,
        direction: 'horizontal',
        widthHeightRatio: 1,
        shrink: false,
        responsiveView: true,
        responsiveSizes: false,
        dragAndDrop: true,
        resizable: false,
        useCSSTransforms: false,
        floating: true,
        tolerance: 'pointer'
    };

    change: Observable<IGridsterOptions>;

    responsiveOptions: Array<IGridsterOptions> = [];
    basicOptions: IGridsterOptions;

    breakpointsMap = {
        sm: 576, // Small devices
        md: 768, // Medium devices
        lg: 992, // Large devices
        xl: 1200 // Extra large
    };

    constructor(config: IGridsterOptions) {
        this.basicOptions = config;

        this.responsiveOptions = this.extendResponsiveOptions(config.responsiveOptions || []);

        this.change = merge(
                of(this.getOptionsByWidth(document.documentElement.clientWidth)),
                fromEvent(window, 'resize').pipe(
                    debounceTime(config.responsiveDebounce || 0),
                    map((event: Event) => this.getOptionsByWidth(document.documentElement.clientWidth))
                )
            ).pipe(distinctUntilChanged(null, (options: any) => options.minWidth));
    }

    getOptionsByWidth(width: number): IGridsterOptions {
        let i = 0;
        let options: IGridsterOptions = Object.assign({}, this.defaults, this.basicOptions);

        while (this.responsiveOptions[i]) {
            if (this.responsiveOptions[i].minWidth <= width) {
                options = this.responsiveOptions[i];
            }
            i++;
        }

        return options;
    }

    private extendResponsiveOptions(responsiveOptions: Array<IGridsterOptions>): Array<IGridsterOptions> {
        return responsiveOptions
            // responsive options are valid only with "breakpoint" property
            .filter(options => options.breakpoint)
            // set default minWidth if not given
            .map((options) => {
                return Object.assign({
                    minWidth: this.breakpointsMap[options.breakpoint] || 0
                }, options);
            })
            .sort((curr, next) => curr.minWidth - next.minWidth)
            .map((options) => <IGridsterOptions>Object.assign({}, this.defaults, this.basicOptions, options));
    }
}
