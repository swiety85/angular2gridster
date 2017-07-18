import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'a2g-chart-widget',
    templateUrl: './chart-widget.component.html',
    styleUrls: ['./chart-widget.component.scss']
})
export class ChartWidgetComponent implements OnInit {
    @Input() data: any;

    constructor() {
    }

    ngOnInit() {
    }
}
