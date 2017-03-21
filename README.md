# angular2gridster
[![npm version](https://badge.fury.io/js/angular2gridster.svg)](https://badge.fury.io/js/angular2gridster)

Angular 2 implementation of well known Gridster (no jQuery, no external libraries, only Angular2 and Rx.js). [Demo](https://swiety85.github.io/angular2gridster/).

## Installation
```shell
npm install angular2gridster
```  
Once installed you need to import our module:
```js
    import {GridsterModule} from 'angular2gridster';

    @NgModule({
      declarations: [AppComponent, ...],
      imports: [GridsterModule, ...],  
      bootstrap: [AppComponent]
    })
    export class AppModule {
    }
```
## Example usage

```html
    <gridster [options]="gridsterConfig"  [draggableOptions]="{ handlerClass: 'panel-heading' }">
        <gridster-item *ngFor="let widget of widgets" [x]="widget.x" [y]="widget.y" [w]="widget.w" [h]="widget.h">
            ...
        </gridster-item>
    </gridster>
```

```js
gridsterConfig:IGridsterOptions = {
    lanes: 5,
    direction: 'vertical',
    dragAndDrop: true
};
```

## Adding widgets
Use directive "gridsterItemPrototype" that allows to add new widget to dashboard by dragging from outside.
Directive expect following attributes:
 *    gridsterItemPrototype - (required) directive definition and configuration object as a value.
 Possible options:
     helper - {boolean} if true, dragging element will be a clone of original appended to body
 *   w - (required) {number} widget width
 *   h - (required) {number} widget height
 *   drop - (optional) {EventEmitter} called on drop to gridster
 *   start - (optional) {EventEmitter} called on start dragging
 *   cancel - (optional) {EventEmitter} called on drop outside of gridster area
 *   enter - (optional) {EventEmitter} called on drag enter over gridster area
 *   out - (optional) {EventEmitter} called on drag out of gridster area

### Example
```html
    <div gridsterItemPrototype [config]="{helper: true}" [w]="1" [h]="2"
         (drop)="addWidget(gridster, $event)"
         (enter)="over($event)"
         (out)="out($event)"> ... </div>
```

## Demo

Clone or download this repository. Demo folder is dedicated nester project build on Angular CLI. To run:

```shell
    cd demo
    npm install
    ng serve
```

Go to: http://localhost:4200/

## Compilation problems
If somebody will have compilation problems please add an issue (if not yet created). I will try to fix it as soon as possible.
Angular compiler has still some issues opened that can be a problem to you this module in your project. If so please,
as a temporary solution copy files from /src folder to dedicated folder in your project.

## Issues

If the current behavior is a bug or you can illustrate your feature request better with an example, 
please provide the steps to reproduce and if possible a minimal demo of the problem via plnkr (http://plnkr.co/edit/4pGyURZVVrL6MONXc8A0?p=preview)