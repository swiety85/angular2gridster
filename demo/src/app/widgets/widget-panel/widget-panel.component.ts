import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'a2g-widget-panel',
    templateUrl: './widget-panel.component.html',
    styleUrls: ['./widget-panel.component.scss']
})
export class WidgetPanelComponent implements OnInit {
    @Input() move: boolean;
    @Output() moveChange = new EventEmitter<boolean>();
    @Input() resize: boolean;
    @Output() resizeChange = new EventEmitter<boolean>();

    @Input() options: any = {
        removable: false,
        hasMoveSwitcher: false,
        hasResizeSwitcher: false
    };

    @Input() title: string;

    @Output() remove = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit() {
    }

}
