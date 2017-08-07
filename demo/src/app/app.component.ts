import { Component, ViewChild, OnInit, Type } from '@angular/core';
import { GridsterComponent } from './gridster/gridster.component';
import { IGridsterOptions } from './gridster/IGridsterOptions';
import { IGridsterDraggableOptions } from './gridster/IGridsterDraggableOptions';
import { DashboardService } from './dashboard.service';
import { GridListItem } from './gridster/gridList/GridListItem';
import { WidgetTypesService } from './widgets/widget-types.service';

@Component({
    selector: 'a2g-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [DashboardService]
})
export class AppComponent implements OnInit {
    @ViewChild(GridsterComponent) gridster: GridsterComponent;
    isAsideOpen = true;

    gridsterOptions: IGridsterOptions;
    itemOptions: any;
    gridsterDraggableOptions: IGridsterDraggableOptions;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.gridsterOptions = this.dashboardService.options;
        this.itemOptions = this.dashboardService.widgetOptions;
        this.gridsterDraggableOptions = this.dashboardService.draggableOptions;
    }

    getWidgets() {
        return this.dashboardService.widgets;
    }

    // resetGridsterSize() {
    //     console.log(<HTMLElement>document.querySelector('.gridster-container'));
    //     (<HTMLElement>document.querySelector('.gridster-container')).style.width = '';
    // }

    optionsChange(options: IGridsterOptions) {
        this.gridsterOptions = options;
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
            yXl: item.getValueY('xl')
        })).store();

    }

    removeItem(index: number): void {
        this.dashboardService.removeWidget(index).store();
    }

    widgetChanged() {
        this.dashboardService.store();
    }

    getComponentType(widget): Type<any> {
        return WidgetTypesService.COMPONENTS_MAP[widget.component];
    }
}
