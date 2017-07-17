import {Component, OnInit} from '@angular/core';

@Component ({
    selector: 'a2g-widget-bar',
    templateUrl: './widget-bar.component.html',
    styleUrls: ['./widget-bar.component.scss']
})
export class WidgetBarComponent implements OnInit {

    private _isOpen = false;

    constructor () {
    }

    ngOnInit () {
    }

    open () {
        this._isOpen = true;
    }

    close () {
        this._isOpen = false;
    }

    toggle () {
        this._isOpen = !this._isOpen;
    }

    isOpen() {
        return  this._isOpen;
    }
}
