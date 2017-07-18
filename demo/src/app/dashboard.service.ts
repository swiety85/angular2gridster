import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TestComponent} from './test/test.component';
import {ChartWidgetComponent} from './widgets/chart-widget/chart-widget.component';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class DashboardService {
    static STORAGE_KEY: string = 'dashboard';
    static COMPONENTS_MAP = {
        'test': TestComponent,
        'chart': ChartWidgetComponent
    };

    widgets = [
        {
            component: 'test',
            title: 'Test title',
            data: {test: 'test1'},
            x: 0, y: 0,
            w: 2, h: 3,
            dragAndDrop: true,
            resizable: true,
            removable: true
        }
    ];

    private storageChangeSubject: Subject<string> = new Subject();

    constructor() {
    }

    getWidgets() {
        return Observable.concat(
                Observable.of(localStorage.getItem(DashboardService.STORAGE_KEY)),
                this.storageChangeSubject
            )
            .map((storageValue: string) => {
                if (storageValue) {
                    return JSON.parse(storageValue);
                } else {
                    return this.widgets;
                }
            })
            .map((rawWidgets) => {
                return rawWidgets.map((item) => {
                    return Object.assign({}, item, {
                        component: DashboardService.COMPONENTS_MAP[item.component]
                    });
                });
            })
            .catch(() => Observable.of([]));
    }

    updateWidget(index, widget) {
        const component = this.widgets[index].component;
        this.widgets[index] = Object.assign({}, widget, { component });
        this.store();
    }

    addWidget(widget) {
        this.widgets.push(widget);
        this.store();
    }

    removeWidget(index: number) {
        this.widgets.splice(index, 1);
        this.store();
    }

    private store() {
        const jsonData = JSON.stringify(this.widgets);

        localStorage.setItem(DashboardService.STORAGE_KEY, jsonData);
        this.storageChangeSubject.next(jsonData)
    }
}
