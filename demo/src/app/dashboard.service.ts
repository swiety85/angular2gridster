import {Injectable} from '@angular/core';
import {IGridsterOptions} from './gridster/IGridsterOptions';
import {IGridsterDraggableOptions} from './gridster/IGridsterDraggableOptions';

@Injectable()
export class DashboardService {
    static STORAGE_KEY_WIDGETS: string = 'dashboard.widgets';
    static STORAGE_KEY_OPTIONS: string = 'dashboard.options';

    private _options: IGridsterOptions = {
        // core configuration is default one - for smallest view. It has hidden minWidth: 0.
        lanes: 2, // amount of lanes (cells) in the grid
        direction: 'vertical', // floating top - vertical, left - horizontal
        dragAndDrop: true, // enable/disable drag and drop for all items in grid
        resizable: true, // enable/disable resizing by drag and drop for all items in grid
        widthHeightRatio: 0.8, // proportion between item width and height
        shrink: true,
        responsiveView: true, // turn on adopting items sizes on window resize and enable responsiveOptions
        responsiveDebounce: 500, // window resize debounce time
        // List of different gridster configurations for different breakpoints.
        // Each breakpoint is defined by name stored in "breakpoint" property. There is fixed set of breakpoints
        // available to use with default minWidth assign to each.
        // - sm: 576 - Small devices
        // - md: 768 - Medium devices
        // - lg: 992 - Large devices
        // - xl: 1200 - Extra large
        // MinWidth for each breakpoint can be overwritten like it's visible below.
        // ResponsiveOptions can overwrite default configuration with any option available.
        responsiveOptions: [
            {
                breakpoint: 'sm',
                lanes: 4
            },
            // {
            //     breakpoint: 'md',
            //     minWidth: 768,
            //     lanes: 4
            // },
            {
                breakpoint: 'lg',
                minWidth: 1024,
                lanes: 7
            },
            {
                breakpoint: 'xl',
                minWidth: 1400,
                lanes: 8
            }
        ]
    };
    widgetOptions = {
        // minWidth: 2,
        // minHeight: 2,
        // maxWidth: 6,
        // maxHeight: 6
    };
    draggableOptions: IGridsterDraggableOptions = {
        handlerClass: 'panel-heading'
    };

    options: IGridsterOptions;
    widgets = [];

    /* tslint:disable */
    private initWidgets = '[{"component":"text","title":"Sample text","data":{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},"x":0,"y":0,"w":2,"h":3,"xSm":0,"ySm":0,"xMd":0,"yMd":0,"xLg":0,"yLg":0,"xXl":0,"yXl":0,"dragAndDrop":true,"resizable":true,"removable":true},{"id":"pieChart","component":"chart","title":"Bar chart","icon":"pie_chart","w":2,"h":2,"dragAndDrop":true,"resizable":true,"removable":true,"data":{"type":"pie","data":[350,450,100],"labels":["Download Sales","In-Store Sales","Mail-Order Sales"]},"x":0,"y":3,"xSm":5,"ySm":0,"xMd":5,"yMd":0,"xLg":5,"yLg":0,"xXl":5,"yXl":0},{"id":"barChart","component":"chart","title":"Bar chart","icon":"insert_chart","w":3,"h":2,"dragAndDrop":true,"resizable":true,"removable":true,"data":{"type":"bar","datasets":[{"data":[65,59,80,81,56,55,40],"label":"Series A"},{"data":[28,48,40,19,86,27,90],"label":"Series B"}],"labels":["2006","2007","2008","2009","2010","2011","2012"],"options":{"scaleShowVerticalLines":false,"responsive":true},"legend":true},"x":2,"y":5,"xSm":1,"ySm":4,"xMd":2,"yMd":2,"xLg":2,"yLg":0,"xXl":2,"yXl":0},{"id":"text","component":"text","title":"Sample text","icon":"short_text","w":5,"h":2,"dragAndDrop":true,"resizable":true,"removable":true,"data":{"text":"Sample text"},"x":0,"y":7,"xSm":2,"ySm":6,"xMd":2,"yMd":0,"xLg":2,"yLg":4,"xXl":2,"yXl":0},{"id":"text","component":"text","title":"Sample text","icon":"short_text","w":2,"h":2,"dragAndDrop":true,"resizable":true,"removable":true,"data":{"text":"Sample text"},"x":0,"y":9,"xSm":4,"ySm":8,"xMd":4,"yMd":0,"xLg":0,"yLg":5,"xXl":0,"yXl":5},{"id":"text","component":"text","title":"Sample text","icon":"short_text","w":3,"h":2,"dragAndDrop":true,"resizable":true,"removable":true,"data":{"text":"Sample text"},"x":0,"y":11,"xSm":5,"ySm":10,"xMd":5,"yMd":0,"xLg":4,"yLg":2,"xXl":4,"yXl":4},{"id":"text","component":"text","title":"Sample text","icon":"short_text","w":2,"h":2,"dragAndDrop":true,"resizable":true,"removable":true,"data":{"text":"Sample text"},"x":0,"y":13,"xSm":3,"ySm":8,"xMd":3,"yMd":0,"xLg":0,"yLg":3,"xXl":2,"yXl":4},{"id":"text","component":"text","title":"Sample text","icon":"short_text","w":2,"h":2,"dragAndDrop":true,"resizable":true,"removable":true,"data":{"text":"Sample text"},"x":0,"y":15,"xSm":2,"ySm":2,"xMd":2,"yMd":0,"xLg":2,"yLg":2,"xXl":0,"yXl":3}]';
    /* tslint:enable */

    constructor() {

        this.widgets = this.getWidgetsFromStorage() || JSON.parse(this.initWidgets);

        this.options = this.getOptionsFromStorage() || this._options;
    }

    addWidget(widget): this {
        this.widgets.push(widget);

        return this;
    }

    removeWidget(index: number): this {
        this.widgets.splice(index, 1);

        return this;
    }

    store() {
        const jsonWidgets = JSON.stringify(this.widgets);
        localStorage.setItem(DashboardService.STORAGE_KEY_WIDGETS, jsonWidgets);

        const jsonOptions = JSON.stringify(this.options);
        localStorage.setItem(DashboardService.STORAGE_KEY_OPTIONS, jsonOptions);

        return this;
    }

    resetOptions(): this {
        this.options = this._options;

        return this;
    }

    resetWidgets(): this {
        this.widgets = JSON.parse(this.initWidgets);

        return this;
    }

    private getWidgetsFromStorage(): Array<any> | null {
        let widgets;

        try {
            widgets = JSON.parse(localStorage.getItem(DashboardService.STORAGE_KEY_WIDGETS));
        } catch (e) {
        }

        return widgets || null;
    }

    private getOptionsFromStorage(): Array<any> | null {
        let options;

        try {
            options = JSON.parse(localStorage.getItem(DashboardService.STORAGE_KEY_OPTIONS));
        } catch (e) {
        }

        return options || null;
    }
}
