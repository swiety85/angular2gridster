import {IGridsterOptions} from './IGridsterOptions';
import { Observable } from 'rxjs/Observable';

export class GridsterOptions {
    direction: string;
    lanes: number;
    widthHeightRatio: number;
    heightToFontSizeRatio: number;
    responsiveView: boolean;
    dragAndDrop: boolean;
    resizable: boolean;
    defaultItemWidth: number;
    defaultItemHeight: number;

    maxWidth: number;
    minWidth: number;
    maxHeight: number;
    minHeight: number;

    change: Observable<IGridsterOptions>;

    private responsiveOptions: Array<IGridsterOptions> = [];
    private basicOptions: IGridsterOptions;

    constructor(config: IGridsterOptions) {
        this.basicOptions = config;

        this.responsiveOptions = (config.responsiveOptions || [])
            .filter((options) => options.minWidth)
            .sort((curr, next) => curr.minWidth - next.minWidth)
            .map((options) => Object.assign({}, this.basicOptions, options));


        // TODO: responsive debounce option
        this.change = Observable.fromEvent(window, 'resize')
            .debounceTime(config.responsiveDebounce || 0)
            .map(() => {
                return this.getOptionsByWidth(window.outerWidth);
            });
    }

    getOptionsByWidth(width: number): IGridsterOptions {
        let options: IGridsterOptions = this.basicOptions;
        let i = 0;

        while (this.responsiveOptions[i]) {
            if (this.responsiveOptions[i].minWidth <= width) {
                options = this.responsiveOptions[i];
            }
            i++;
        }

        return options;
    }
}
