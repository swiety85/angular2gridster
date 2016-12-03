# angular2gridster
Angular 2 implementation of well known Gridster (no jQuery, no external libraries, only Angular2 and Rx.js). [Demo](https://swiety85.github.io/angular2gridster/).

## Example usage

    <gridster [options]="gridsterConfig">
        <gridster-item *ngFor="let widget of widgets" [x]="widget.x" [y]="widget.y" [w]="widget.w" [h]="widget.h">
            ...
        </gridster-item>
    </gridster>

```JavaScript
gridsterConfig:IGridsterOptions = {
    lanes: 5,
    direction: 'vertical',
    dragAndDrop: true
};
```
