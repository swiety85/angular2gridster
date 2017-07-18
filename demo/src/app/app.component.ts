import { Component, ViewChild, OnInit } from '@angular/core';
import { GridsterComponent } from './gridster/gridster.component';
import { IGridsterOptions } from './gridster/IGridsterOptions';
import { IGridsterDraggableOptions } from './gridster/IGridsterDraggableOptions';
import { TestComponent } from './test/test.component';
import { DashboardService } from './dashboard.service';
import {Observable} from 'rxjs/Observable';
import {GridListItem} from './gridster/gridList/GridListItem';

@Component({
    selector: 'a2g-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [DashboardService]
})
export class AppComponent implements OnInit {
    @ViewChild(GridsterComponent) gridster: GridsterComponent;
    isAsideOpen = true;

    itemOptions = {
        maxWidth: 3,
        maxHeight: 3
    };
    gridsterOptions: IGridsterOptions = {
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
                // minWidth: 480,
                lanes: 3
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
    widgets: Observable<Array<any>>;
    // widgets: Array<any> = [
    //     {
    //         x: 0, y: 0,
    //         w: 2, h: 3,
    //         dragAndDrop: true,
    //         resizable: true,
    //         removable: false,
    //         hasMoveSwitcher: true,
    //         hasResizeSwitcher: true,
    //         title: 'Basic form inputs 1',
    //         component: TestComponent,
    //         data: {test: 'test1'}
    //     },
    //     {
    //         x: 1, y: 0, w: 3, h: 1,
    //         dragAndDrop: true,
    //         resizable: true,
    //         removable: true,
    //         hasMoveSwitcher: true,
    //         hasResizeSwitcher: true,
    //         title: 'Basic form inputs 2',
    //         component: TestComponent,
    //         data: {test: 'test2'}
    //     },
    //     {
    //         x: 1, y: 1, w: 2, h: 1,
    //         dragAndDrop: true,
    //         resizable: true,
    //         removable: true,
    //         hasMoveSwitcher: true,
    //         hasResizeSwitcher: true,
    //         title: 'Basic form inputs 3',
    //         component: TestComponent,
    //         data: {test: 'test3'}
    //     },
    //     {
    //         x: 3, y: 1, w: 1, h: 2,
    //         dragAndDrop: true,
    //         resizable: true,
    //         removable: true,
    //         hasMoveSwitcher: true,
    //         hasResizeSwitcher: true,
    //         title: 'Basic form inputs 4',
    //         component: TestComponent,
    //         data: {test: 'test4'}
    //     },
    //     {
    //         w: 1, h: 2,
    //         dragAndDrop: true,
    //         resizable: true,
    //         removable: true,
    //         hasMoveSwitcher: true,
    //         hasResizeSwitcher: true,
    //         title: 'Basic form inputs x',
    //         component: TestComponent,
    //         data: {test: 'test'}
    //     }
    // ];

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.widgets = this.dashboardService.getWidgets();
    }

    resetGridsterSize() {
        console.log(<HTMLElement>document.querySelector('.gridster-container'));
        (<HTMLElement>document.querySelector('.gridster-container')).style.width = '';

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
        // this.widgets[0].x = 3;
        // this.widgets[3].x = 0;
    }

    addWidgetFromDrag(gridster: GridsterComponent, event: any) {
        const item = event.item;
        // this.widgets.push({
        //     x: item.x, y: item.y, w: item.w, h: item.h,
        //     dragAndDrop: true,
        //     resizable: true,
        //     title: 'Basic form inputs 5'
        // });

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
        // this.widgets.push({
        //     title: 'Basic form inputs X',
        //     dragAndDrop: true,
        //     resizable: true,
        //     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
        //     'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
        //     'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
        //     'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
        //     'laborum.'
        // });
    }

    addWidget(event: any) {
        const item: GridListItem = event.item;

        this.dashboardService.addWidget(Object.assign({}, event.prototype, {
            x: item.getValueX(),
            y: item.getValueY(),
            xSm: item.getValueX('sm'),
            ySm: item.getValueY('sm'),
            xMd: item.getValueX('md'),
            yMd: item.getValueY('md'),
            xLg: item.getValueX('lg'),
            yLg: item.getValueY('lg'),
            xXl: item.getValueX('xl'),
            yXl: item.getValueY('xl'),
        }));

    }

    removeItem(index: number): void {
        this.dashboardService.removeWidget(index);
    }

    itemChange(event: any, widget, index: number) {
        const item: GridListItem = event.item;

        this.dashboardService.updateWidget(index, Object.assign({}, widget, {
            x: item.getValueX(),
            y: item.getValueY(),
            xSm: item.getValueX('sm'),
            ySm: item.getValueY('sm'),
            xMd: item.getValueX('md'),
            yMd: item.getValueY('md'),
            xLg: item.getValueX('lg'),
            yLg: item.getValueY('lg'),
            xXl: item.getValueX('xl'),
            yXl: item.getValueY('xl'),
            resizable: item.resizable,
            dragAndDrop: item.dragAndDrop
        }));
    }
}
