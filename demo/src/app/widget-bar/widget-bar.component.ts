import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component ({
    selector: 'a2g-widget-bar',
    templateUrl: './widget-bar.component.html',
    styleUrls: ['./widget-bar.component.scss']
})
export class WidgetBarComponent implements OnInit {
    @Output() drop = new EventEmitter<any>();

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

    over(event) {
        const size = event.item.calculateSize(event.gridster);

        event.item.itemPrototype.$element.style.width = size.width + 'px';
        event.item.itemPrototype.$element.style.height = size.height + 'px';
        event.item.itemPrototype.$element.classList.add('is-over');
    }

    out(event) {
        event.item.itemPrototype.$element.style.width = '';
        event.item.itemPrototype.$element.style.height = '';
        event.item.itemPrototype.$element.classList.remove('is-over');
    }
}
