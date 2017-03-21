<a name="0.4.0"></a>
# [0.4.0]((https://github.com/swiety85/angular2gridster/compare/0.3.1...0.4.0)) (2017-03-20)


### Bug Fixes

* **css:** fix problem with drag and scroll on touch devieces
* **build:** recreate build env from scratch


### Features

* **drag-drop** provide directive that allows to add new widget to dashboard by dragging from outside
* **demo:** create Angular CLI demo 
* **demo:** extend demo to show drag widgets from outside
* **drag-drop:** reimplement drag n drop engine
* **api:** refactor API of gridster.service
* **api:** refactor API of gridster.component
* **api:** refactor API of gridser.item.component



<a name="0.3.1"></a>
# [0.3.1]((https://github.com/swiety85/angular2gridster/compare/0.3.0...0.3.1)) (2017-01-24)


### Bug Fixes

* **api** move IGridsterOptions and IGridsterDraggableOptions to separate files, closes [#9](https://github.com/swiety85/angular2gridster/issues/9)


<a name="0.3.0"></a>
# [0.3.0]((https://github.com/swiety85/angular2gridster/compare/0.2.3...0.3.0)) (2017-01-24)


### Bug Fixes

* **css:** move css of position-highlight outside of gridster component
* **css:** move inner item styles outside of gridster components
* **css:** fix position-highlight styles
* **demo:** fix demo styles
* **drag-drop:** fix problem of wrong mouse position when dragging and scrolling at once
* **api:** replace IGridListItem with GridsterItemComponent
* **api:** add isDragging property to GridsterItemComponent with class binding in template, instead of manipulating DOM
* **api:** remove GridList cloneItems method

### Features

* **config:** add possibility to set gridster draggable options from outside
* **config:** gridsterPositionChange Event Emmiter
* **config:** gridster item x,y two way databind
* **config:** add/remove gridster item
* **css:** set dynamic gridster container width and height set by service



<a name="0.2.3"></a>
# [0.2.3]((https://github.com/swiety85/angular2gridster/compare/0.2.2...0.2.3)) (2016-12-21)


### Bug Fixes

* **build:** fix demo - webpack server reload
* **deps:** fix issue with IGridsterOptions not found (https://github.com/swiety85/angular2gridster/issues/4)
* **config:** fix gridster item resize after position change



<a name="0.2.2"></a>
# [0.2.2](https://github.com/swiety85/angular2gridster/compare/0.2.0...0.2.2) (2016-12-11)


### Bug Fixes

* **build:** remove old Angular CLI dependencies in package.json
* **build:** fixes for build process

### Features

* **config:** add possibility to dynamically change gridster item size
* **config:** add possibility to dynamically change gridster configuration
* **demo:** add option to change size of gridster items
* **demo:** add option to change gridster direction (floating): vertical/horizontal
* **demo:** add option to change amount of gridster lines



<a name="0.2.0"></a>
# 0.2.0 (2016-12-03)


### Features

* **build:** Angular CLI build was replaced with custom webpack build
* **demo:** create demo app component 