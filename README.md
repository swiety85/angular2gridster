# angular2gridster
[![npm version](https://badge.fury.io/js/angular2gridster.svg)](https://badge.fury.io/js/angular2gridster)

Angular 2 implementation of well known Gridster (no jQuery, no external libraries, only Angular2 and Rx.js). [Demo](https://swiety85.github.io/angular2gridster/).

1. [Getting started](https://github.com/swiety85/angular2gridster/wiki/Getting-started)
2. [What is Angular2gridster and why to use it?](https://github.com/swiety85/angular2gridster/wiki) 
3. [API Documentation](https://github.com/swiety85/angular2gridster/wiki/API-Documentation)
4. [Roadmap](https://github.com/swiety85/angular2gridster/wiki/Roadmap)

More comprehensive documentation is available in [Wiki](https://github.com/swiety85/angular2gridster/wiki).

Development progress can be tracked in [Milestones](https://github.com/swiety85/angular2gridster/milestones) and in [Project board](https://github.com/swiety85/angular2gridster/projects/1).

## Installation
```shell
npm install angular2gridster
```
Once installed you need to import our module:

```js
...
import { GridsterModule } from 'angular2gridster';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...
    GridsterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
The example it imports in AppModule, but it could also be imported in any other module - depends where you want to use it.

### Additional steps for System.js

To make Angular2gridster works with System.js you need to provide dedicated configuration in `systemjs.config.js`.
It requires change in `map` object and 'packages' as follows:
```js
System.config({
  map: {
    // ...
    'rxjs':             'node_modules/rxjs',
    'angular2gridster': 'node_modules/angular2gridster'
  },
  packages: {
    // ...
    'rxjs':             { defaultExtension: 'js' },
    'angular2gridster': { main: 'dist/index.js', defaultExtension: 'js' }
  }
});
```

## Example usage

```html
<gridster [options]="gridsterOptions" [draggableOptions]="{ handlerClass: 'panel-heading' }">

  <gridster-item *ngFor="let widget of widgets" 
                 [(x)]="widget.x" [(y)]="widget.y" [(w)]="widget.w" [(h)]="widget.h">
      <!--some content-->
  </gridster-item>

</gridster>
```

```js
widgets: Array<any> = [...];
gridsterOptions = {
  lanes: 2, // how many lines (grid cells) dashboard has
  direction: 'vertical', // items floating direction: vertical/horizontal/none
  floating: false, // default=true - prevents items to float according to the direction (gravity)
  dragAndDrop: false, // possible to change items position by drag n drop
  resizable: false, // possible to resize items by drag n drop by item edge/corner
  useCSSTransforms: true, // Uses CSS3 translate() instead of position top/left - significant performance boost.
  // ResponsiveOptions can overwrite default configuration with any option available for specific breakpoint.
  responsiveOptions: [
        {
            breakpoint: 'sm',
            lanes: 3
        },
        {
            breakpoint: 'md',
            minWidth: 768,
            lanes: 4,
            dragAndDrop: true,
            resizable: true
        },
        {
            breakpoint: 'lg',
            lanes: 6,
            dragAndDrop: true,
            resizable: true
        },
        {
            breakpoint: 'xl',
            minWidth: 1800,
            lanes: 8,
            dragAndDrop: true,
            resizable: true
        }
    ]
};
```

## Demo

Clone or download this repository. Demo folder is dedicated nester project build on Angular CLI. To run:

Create symlink from library `src` directory to `demo/src/app/gridster` use absolute path for that:

linux, macos:
```shell
cd angular2gridster
ln -s $PWD/src/ $PWD/demo/src/app/gridster
```

After that, linked directory should appear
```
angular2gridster
├─ demo
│  └─ src
│     └─ app
│        └─ gridster //symlink
└─ src
```

Lunch demo app:

```shell
    npm run install-demo
    npm run serve-demo
```

Go to: http://localhost:4200/

## Compilation problems
If somebody will have compilation problems please add an issue (if not yet created). I will try to fix it as soon as possible.
Angular compiler has still some issues opened that can be a problem to you this module in your project. If so please,
as a temporary solution copy files from /src folder to dedicated folder in your project.

## Issues

If the current behavior is a bug or you can illustrate your feature request better with an example, 
please provide the steps to reproduce and if possible a minimal demo of the problem via plnkr (http://plnkr.co/edit/4pGyURZVVrL6MONXc8A0?p=preview).
The project is in development so don't hesitate to writte any questions or suggestion on issue list.
I look forward to get response from you.

## Origin

This project was created on idea of [GridList](https://github.com/hootsuite/grid). Great alternative for Gridster.