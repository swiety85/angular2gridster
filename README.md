# angular2gridster

[![npm version](https://badge.fury.io/js/angular2gridster.svg)](https://badge.fury.io/js/angular2gridster)

Angular implementation of well known Gridster (no jQuery, no external libraries, only Angular and Rx.js). [Demo](https://swiety85.github.io/angular2gridster/).

1. [Getting started](https://github.com/swiety85/angular2gridster/wiki/Getting-started)
2. [What is Angular2gridster and why to use it?](https://github.com/swiety85/angular2gridster/wiki)
3. [API Documentation](https://github.com/swiety85/angular2gridster/wiki/API-Documentation)
4. [Roadmap](https://github.com/swiety85/angular2gridster/wiki/Roadmap)

More comprehensive documentation is available in [Wiki](https://github.com/swiety85/angular2gridster/wiki).

Development progress can be tracked in [Milestones](https://github.com/swiety85/angular2gridster/milestones) and in [Project board](https://github.com/swiety85/angular2gridster/projects/1).

## Versions:

-   Version **12.x** works with **Angular 12.x**.
-   Version **11.x** works with **Angular 11.x**.
-   Version **10.x** works with **Angular 10.x**.
-   Version **9.x** works with **Angular 9.x**.
-   Version **8.x** works with **Angular 8.x**.
-   Version **7.x** works with **Angular 7.x**.
-   Version **6.x** works with **Angular 6.x**.
-   Version **5.x** works with **Angular 5.x**.
-   Version **4.x** works with **Angular 4.x**.

Versions **1.x** and **0.x** works only with **Angular 4.x**, but the newest states you can find in **v4.x**.

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
    GridsterModule.forRoot() // .forRoot() is required since version v4+
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
        rxjs: 'node_modules/rxjs',
        angular2gridster: 'node_modules/angular2gridster',
    },
    packages: {
        // ...
        rxjs: {defaultExtension: 'js'},
        angular2gridster: {main: 'dist/index.js', defaultExtension: 'js'},
    },
});
```

## Example usage

```html
<ngx-gridster [options]="gridsterOptions" [draggableOptions]="{ handlerClass: 'panel-heading' }">
    <ngx-gridster-item
        *ngFor="let widget of widgets"
        [(x)]="widget.x"
        [(y)]="widget.y"
        [(w)]="widget.w"
        [(h)]="widget.h"
    >
        <!-- some content -->
    </ngx-gridster-item>
</ngx-gridster>
```

For version before 6.0.0:

```html
<gridster [options]="gridsterOptions" [draggableOptions]="{ handlerClass: 'panel-heading' }">
    <gridster-item
        *ngFor="let widget of widgets"
        [(x)]="widget.x"
        [(y)]="widget.y"
        [(w)]="widget.w"
        [(h)]="widget.h"
    >
        <!-- some content -->
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
  responsiveSizes: true, // allow to set different item sizes for different breakpoints
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

**Warning**

If you use `responsiveOptions`, then item coords will be assigned to different breakpoint attributes:

-   till `sm` (480px), it uses `x` and `y` attributes
-   `sm` (480px - 768px), it uses `xSm` and `ySm` attributes
-   `md` (768px - 1250px), it uses `xMd` and `yMd` attributes
-   `lg` (1250px - 1800px), it uses `xLg` and `yLg` attributes
-   from `xl` (1800px), it uses `xXl` and `yXl` attributes

(widths in px are only example and works for `responsiveOptions in example above).

If you set `responsiveSizes: true`, item size can be different for different breakpoints. In this case size will be binded to following attributes:

-   till `sm` (480px), it uses `w` and `h` attributes
-   `sm` (480px - 768px), it uses `wSm` and `hSm` attributes
-   `md` (768px - 1250px), it uses `wMd` and `hMd` attributes
-   `lg` (1250px - 1800px), it uses `wLg` and `hLg` attributes
-   from `xl` (1800px), it uses `wXl` and `hXl` attributes

## Demo

Clone or download this repository and just run:

```js
npm i
npm run build
npm start
```

Go to: http://localhost:4200/

## Compilation problems

If somebody will have compilation problems please add an issue (if not yet created). I will try to fix it as soon as possible.
Angular compiler has still some issues opened and it is changing frequently.

As a temporary solution copy files from `/projects/angular2gridster/src/lib` folder to dedicated folder in your project.

## Issues

If the current behavior is a bug or you can illustrate your feature request better with an example,
please provide the steps to reproduce and if possible a minimal demo of the problem via CodeSandbox:

[![Edit Angular](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/angular-otned?fontsize=14)

The project is in development so don't hesitate to writte any questions or suggestion on issue list.
I look forward to get a response from you.

## Origin

This project was created on idea of [GridList](https://github.com/hootsuite/grid). Great alternative for Gridster.
