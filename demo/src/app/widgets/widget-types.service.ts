import {Injectable} from '@angular/core';

@Injectable()
export class WidgetTypesService {

    widgetTypes = [
        {
            id: 'pieChart',
            component: 'chart',
            title: 'Bar chart',
            icon: 'pie_chart',
            w: 2, h: 2,
            dragAndDrop: true,
            resizable: true,
            data: {
                type: 'pie',
                data: [350, 450, 100],
                labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales']
            }
        },
        {
            id: 'barChart',
            component: 'chart',
            title: 'Bar chart',
            icon: 'insert_chart',
            w: 3, h: 2,
            dragAndDrop: true,
            resizable: true,
            data: {
                type: 'bar',
                datasets: [
                    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
                    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
                ],
                labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
                options: {
                    scaleShowVerticalLines: false,
                    responsive: true
                },
                legend: true
            }
        },
        {
            id: 'text',
            component: 'test',
            title: 'Sample text',
            icon: 'short_text',
            w: 2, h: 2,
            dargAndDrop: true,
            resizable: true,
            data: {
                type: 'pie',
                data: [350, 450, 100],
                labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales']
            }
        },
    ];

    constructor() {
    }

}
