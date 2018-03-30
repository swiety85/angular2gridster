import {Component, OnInit, ViewChild} from '@angular/core';
import { GridsterComponent } from './gridster/gridster.component';
import { IGridsterOptions } from './gridster/IGridsterOptions';
import { IGridsterDraggableOptions } from './gridster/IGridsterDraggableOptions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    static X_PROPERTY_MAP: any = {
        sm: 'xSm',
        md: 'xMd',
        lg: 'xLg',
        xl: 'xXl'
    };

    static Y_PROPERTY_MAP: any = {
        sm: 'ySm',
        md: 'yMd',
        lg: 'yLg',
        xl: 'yXl'
    };

  static W_PROPERTY_MAP: any = {
    sm: 'wSm',
    md: 'wMd',
    lg: 'wLg',
    xl: 'wXl'
  };

  static H_PROPERTY_MAP: any = {
    sm: 'hSm',
    md: 'hMd',
    lg: 'hLg',
    xl: 'hXl'
  };

    @ViewChild(GridsterComponent) gridster: GridsterComponent;
    itemOptions = {
        maxWidth: 3,
        maxHeight: 4
    };
    gridsterOptions: IGridsterOptions = {
        // core configuration is default one - for smallest view. It has hidden minWidth: 0.
        lanes: 2, // amount of lanes (cells) in the grid
        direction: 'vertical', // floating top - vertical, left - horizontal
        floating: true,
        dragAndDrop: true, // enable/disable drag and drop for all items in grid
        resizable: true, // enable/disable resizing by drag and drop for all items in grid
        resizeHandles: {
            s: true,
            e: true,
            se: true
        },
        widthHeightRatio: 1, // proportion between item width and height
        lines: {
          visible: true,
          color: '#afafaf',
          width: 2
        },
        shrink: true,
        useCSSTransforms: true,
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
                minWidth: 480,
                lanes: 1
            },
            {
                breakpoint: 'md',
                minWidth: 768,
                lanes: 4
            },
            {
                breakpoint: 'lg',
                minWidth: 1250,
                lanes: 6
            },
            {
                breakpoint: 'xl',
                minWidth: 1800,
                lanes: 8
            }
        ]
    };
    gridsterDraggableOptions: IGridsterDraggableOptions = {
        handlerClass: 'panel-heading'
    };
    title = 'Angular2Gridster';
    widgetsCopy = [];
    widgets: Array<any> = [
        {
            x: 0, y: 0, w: 1, h: 2,
            xSm: 0, ySm: 0, wSm: 1, hSm: 1,
            xMd: 0, yMd: 0, wMd: 1, hMd: 2,
            xLg: 0, yLg: 0, wLg: 2, hLg: 3,
            xXl: 0, yXl: 0, wXl: 2, hXl: 2,
            dragAndDrop: true,
            resizable: true,
            title: 'Basic form inputs 1'
        },
        {
            x: 1, y: 0, w: 3, h: 1,
            xSm: 0, ySm: 1, wSm: 1, hSm: 1,
            xMd: 1, yMd: 0, wMd: 3, hMd: 1,
            xLg: 2, yLg: 0, wLg: 2, hLg: 1,
            xXl: 2, yXl: 0, wXl: 2, hXl: 2,
            dragAndDrop: true,
            resizable: true,
            title: 'Basic form inputs 2'
        },
        {
            x: 1, y: 0, w: 2, h: 1,
            xSm: 0, ySm: 2, wSm: 1, hSm: 1,
            xMd: 1, yMd: 1, wMd: 1, hMd: 1,
            xLg: 4, yLg: 0, wLg: 2, hLg: 1,
            xXl: 4, yXl: 0, wXl: 3, hXl: 1,
            dragAndDrop: true,
            resizable: true,
            title: 'Basic form inputs 3'
        },
        {
            x: 3, y: 0, w: 1, h: 2,
            xSm: 0, ySm: 3, wSm: 1, hSm: 1,
            xMd: 2, yMd: 1, wMd: 1, hMd: 2,
            xLg: 2, yLg: 1, wLg: 2, hLg: 2,
            xXl: 2, yXl: 1, wXl: 3, hXl: 2,
            dragAndDrop: true,
            resizable: true,
            title: 'Basic form inputs 4'
        },
        {
            x: 4, y: 0, w: 1, h: 2,
            xSm: 0, ySm: 4, wSm: 1, hSm: 1,
            xMd: 3, yMd: 1, wMd: 1, hMd: 2,
            xLg: 4, yLg: 1, wLg: 2, hLg: 2,
            xXl: 4, yXl: 1, wXl: 3, hXl: 2,
            dragAndDrop: true,
            resizable: true,
            title: 'Basic form inputs x'
        }
    ];

    ngOnInit() {
        this.widgetsCopy = this.widgets.map(widget => ({...widget}));
    }

    onReflow(event) {
        console.log('onReflow', event);
    }

    removeLine(gridster: GridsterComponent) {
        gridster.setOption('lanes', --this.gridsterOptions.lanes)
            .reload();
    }

    getTitle() {
        return this.title;
    }

    addLine(gridster: GridsterComponent) {
        gridster.setOption('lanes', ++this.gridsterOptions.lanes)
            .reload();
    }

    setWidth(widget: any, size: number, e: MouseEvent, gridster) {
        e.stopPropagation();
        e.preventDefault();
        if (size < 1) {
            size = 1;
        }
        widget.w = size;

        gridster.reload();

        return false;
    }

    setHeight(widget: any, size: number, e: MouseEvent, gridster) {
        e.stopPropagation();
        e.preventDefault();
        if (size < 1) {
            size = 1;
        }
        widget.h = size;

        gridster.reload();

        return false;
    }

    optionsChange(options: IGridsterOptions) {
        this.gridsterOptions = options;
        console.log('options change:', options);
    }

    swap() {
        this.widgets[0].x = 3;
        this.widgets[3].x = 0;
    }

    addWidgetFromDrag(gridster: GridsterComponent, event: any) {
        const item = event.item;
        const breakpoint = gridster.options.breakpoint;
        const widget = {
            dragAndDrop: true,
            resizable: true,
            title: 'New widget'
        };
        console.warn('event', event);
        console.warn('item', item);
        console.log(breakpoint, AppComponent.W_PROPERTY_MAP, AppComponent.H_PROPERTY_MAP);
        console.log('AppComponent.W_PROPERTY_MAP[breakpoint]', AppComponent.W_PROPERTY_MAP[breakpoint]);
        console.log('AppComponent.H_PROPERTY_MAP[breakpoint]', AppComponent.H_PROPERTY_MAP[breakpoint]);

        widget[AppComponent.W_PROPERTY_MAP[breakpoint]] = item.itemPrototype[AppComponent.W_PROPERTY_MAP[breakpoint]];
        widget[AppComponent.H_PROPERTY_MAP[breakpoint]] = item.itemPrototype[AppComponent.H_PROPERTY_MAP[breakpoint]];
        widget[AppComponent.X_PROPERTY_MAP[breakpoint]] = item.x;
        widget[AppComponent.Y_PROPERTY_MAP[breakpoint]] = item.y;

        console.log(widget);

        this.widgets.push(widget);

        console.log('add widget from drag to:', gridster);
    }

    over(event) {
        const size = event.item.calculateSize(event.gridster);

        event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width = size.width + 'px';
        event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height = size.height + 'px';
        event.item.itemPrototype.$element.classList.add('is-over');
    }

    out(event) {
        event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width = '';
        event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height = '';
        event.item.itemPrototype.$element.classList.remove('is-over');
    }

    addWidgetWithoutData() {
        this.widgets.push({
            title: 'Basic form inputs X',
            dragAndDrop: true,
            resizable: true,
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
            'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
            'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
            'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
            'laborum.'
        });
    }

    addWidget(gridster: GridsterComponent) {
        this.widgets.push({
            x: 4, y: 0, w: 1, h: 1,
            dragAndDrop: true,
            resizable: true,
            title: 'Basic form inputs 5',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
            'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
            'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
            'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
            'laborum.'
        });
        console.log('widget push', this.widgets[this.widgets.length - 1]);
    }

    remove($event, index: number, gridster: GridsterComponent) {
        $event.preventDefault();
        this.widgets.splice(index, 1);
        console.log('widget remove', index);
    }

    removeAllWidgets() {
        this.widgets = [];
    }

    itemChange($event: any, gridster) {
        console.log('item change', $event);
    }

    resetWidgets() {
        this.widgets = this.widgetsCopy.map(widget => ({...widget}));
    }
}
