import { Component } from '@angular/core';
import { IGridsterOptions, IGridsterDraggableOptions, GridsterComponent } from '../../';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    gridsterOptions:IGridsterOptions = {
        lanes: 5,

        direction: 'vertical',

        dragAndDrop: true
    };
    gridsterDraggableOptions: IGridsterDraggableOptions = {
        handlerClass: 'panel-heading'
    }
    title:string = 'Angular2Gridster';
    widgets:Array<any> = [
        {
            x: 0, y: 0, w: 1, h: 2,
            title: 'Basic form inputs 1',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            x: 1, y: 0, w: 2, h: 1,
            title: 'Basic form inputs 2',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            x: 1, y: 1, w: 2, h: 1,
            title: 'Basic form inputs 3',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            x: 3, y: 0, w: 1, h: 2,
            title: 'Basic form inputs 4',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
    ];

    removeLine(gridster: GridsterComponent) {
        gridster.setOption('lanes', --this.gridsterOptions.lanes)
            .reload();
    }
    addLine(gridster: GridsterComponent) {
        gridster.setOption('lanes', ++this.gridsterOptions.lanes)
            .reload();
    }
    setWidth(widget:any, size:number, e:MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if(size<1) {
            size = 1;
        }
        widget.w = size;

        return false;
    }

    setHeight(widget:any, size:number, e:MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if(size<1) {
            size = 1;
        }
        widget.h = size;

        return false;
    }

    logChanges(items: any){
        console.log('===>> Changed items: ',items);
    }

    swap(){
        this.widgets[0].x = 3;
        this.widgets[3].x = 0;
    }

    addWidget(gridster: GridsterComponent){
        this.widgets.push({
            x: 4, y: 0, w: 1, h: 1,
            title: 'Basic form inputs 5',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        });
        //hack
        setTimeout(() => {
            gridster.reload();
        }, 100);

    }

    remove(index: number, gridster: GridsterComponent){
        this.widgets.splice(index,1);
        setTimeout(() => {
            gridster.reload();
        }, 100);
    }

}
