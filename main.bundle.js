webpackJsonp([1,4],{

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridListItem; });
var GridListItem = (function () {
    function GridListItem() {
    }
    Object.defineProperty(GridListItem.prototype, "$element", {
        get: function () {
            return this.getItem().$element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "x", {
        get: function () {
            return this.getItem().x;
        },
        set: function (value) {
            this.getItem().x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "y", {
        get: function () {
            return this.getItem().y;
        },
        set: function (value) {
            this.getItem().y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "w", {
        get: function () {
            return this.getItem().w;
        },
        set: function (value) {
            this.getItem().w = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "h", {
        get: function () {
            return this.getItem().h;
        },
        set: function (value) {
            this.getItem().h = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridListItem.prototype, "autoSize", {
        get: function () {
            return this.getItem().autoSize;
        },
        set: function (value) {
            this.getItem().autoSize = value;
        },
        enumerable: true,
        configurable: true
    });
    GridListItem.prototype.setFromGridsterItem = function (item) {
        if (this.itemComponent || this.itemPrototype || this.itemObject) {
            throw new Error('GridListItem is already set.');
        }
        this.itemComponent = item;
        return this;
    };
    GridListItem.prototype.setFromGridsterItemPrototype = function (item) {
        if (this.itemComponent || this.itemPrototype || this.itemObject) {
            throw new Error('GridListItem is already set.');
        }
        this.itemPrototype = item;
        return this;
    };
    GridListItem.prototype.setFromObjectLiteral = function (item) {
        if (this.itemComponent || this.itemPrototype || this.itemObject) {
            throw new Error('GridListItem is already set.');
        }
        this.itemObject = item;
        return this;
    };
    GridListItem.prototype.copy = function () {
        var itemCopy = new GridListItem();
        return itemCopy.setFromObjectLiteral({
            $element: this.$element,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            autoSize: this.autoSize
        });
    };
    GridListItem.prototype.getItem = function () {
        var item = this.itemComponent || this.itemPrototype || this.itemObject;
        if (!item) {
            throw new Error('GridListItem is not set.');
        }
        return item;
    };
    return GridListItem;
}());
//# sourceMappingURL=GridListItem.js.map

/***/ }),

/***/ 232:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gridster_service__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gridList_GridListItem__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_draggable__ = __webpack_require__(235);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridsterItemComponent; });





var GridsterItemComponent = (function () {
    function GridsterItemComponent(cdr, elementRef, gridster) {
        this.cdr = cdr;
        this.xChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.yChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.wChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.hChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.isDragging = false;
        this.isResizing = false;
        this.subscriptions = [];
        this.dragSubscriptions = [];
        this.resizeSubscriptions = [];
        this.gridster = gridster;
        this.elementRef = elementRef;
        this.$element = elementRef.nativeElement;
        this.item = (new __WEBPACK_IMPORTED_MODULE_3__gridList_GridListItem__["a" /* GridListItem */]()).setFromGridsterItem(this);
        // if gridster is initialized do not show animation on new grid-item construct
        if (this.gridster.$element) {
            this.preventAnimation();
        }
    }
    GridsterItemComponent.prototype.ngAfterViewInit = function () {
        if (this.gridster.options.resizable) {
            this.enableResizable();
        }
        this.cdr.detach();
    };
    GridsterItemComponent.prototype.ngOnInit = function () {
        this.w = this.w || this.gridster.options.defaultItemWidth;
        this.h = this.h || this.gridster.options.defaultItemHeight;
        if (this.gridster.$element) {
            var position = this.gridster.findDefaultPosition(this.item.w, this.item.h);
            this.item.x = position[0];
            this.item.y = position[1];
        }
        if ((this.x || this.x === 0) && (this.y || this.y === 0)) {
            this.enableItem();
        }
        else {
            this.gridster.disabledItems.push(this.item);
        }
    };
    GridsterItemComponent.prototype.ngOnChanges = function () {
        if (!this.gridster.gridList) {
            return;
        }
        this.gridster.gridList.resolveCollisions(this.item);
        this.gridster.render();
    };
    GridsterItemComponent.prototype.ngOnDestroy = function () {
        var index = this.gridster.items.indexOf(this.item);
        if (index >= 0) {
            this.gridster.items.splice(index, 1);
        }
        this.gridster.gridList.pullItemsToLeft();
        this.gridster.render();
        this.subscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.disableDraggable();
        this.disableResizable();
    };
    GridsterItemComponent.prototype.enableItem = function () {
        this.gridster.registerItem(this.item);
        //  only if new item is registered after bootstrap
        if (this.gridster.$element) {
            this.gridster.gridList.resolveCollisions(this.item);
            this.gridster.reflow();
        }
        if (this.gridster.options.dragAndDrop) {
            this.enableDragDrop();
        }
    };
    GridsterItemComponent.prototype.enableResizable = function () {
        var _this = this;
        if (this.resizeSubscriptions.length) {
            return;
        }
        [].forEach.call(this.$element.querySelectorAll('.gridster-item-resizable-handler'), function (handler) {
            handler.style.display = 'block';
            var draggable = new __WEBPACK_IMPORTED_MODULE_4__utils_draggable__["a" /* Draggable */](handler);
            var direction;
            var startEvent;
            var startData;
            var cursorToElementPosition;
            var dragStartSub = draggable.dragStart
                .subscribe(function (event) {
                _this.isResizing = true;
                startEvent = event;
                direction = _this.getResizeDirection(handler);
                startData = _this.createResizeStartObject(direction);
                cursorToElementPosition = event.getRelativeCoordinates(_this.$element);
                _this.gridster.onResizeStart(_this.item);
            });
            var dragSub = draggable.dragMove
                .subscribe(function (event) {
                var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                _this.resizeElement({
                    direction: direction,
                    startData: startData,
                    position: {
                        x: event.clientX - cursorToElementPosition.x -
                            _this.gridster.gridsterOffset.left - _this.gridster.gridsterRect.left,
                        y: event.clientY - cursorToElementPosition.y -
                            _this.gridster.gridsterOffset.top - _this.gridster.gridsterRect.top
                    },
                    startEvent: startEvent,
                    moveEvent: event,
                    scrollDiffX: scrollLeft - startData.scrollLeft,
                    scrollDiffY: scrollTop - startData.scrollTop
                });
                _this.gridster.onResizeDrag(_this.item);
            });
            var dragStopSub = draggable.dragStop
                .subscribe(function () {
                _this.isResizing = false;
                _this.gridster.onResizeStop(_this.item);
            });
            _this.resizeSubscriptions = _this.resizeSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);
        });
    };
    GridsterItemComponent.prototype.disableResizable = function () {
        this.resizeSubscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.resizeSubscriptions = [];
        [].forEach.call(this.$element.querySelectorAll('.gridster-item-resizable-handler'), function (handler) {
            handler.style.display = '';
        });
    };
    GridsterItemComponent.prototype.enableDragDrop = function () {
        var _this = this;
        if (this.dragSubscriptions.length) {
            return;
        }
        var cursorToElementPosition;
        var draggable = new __WEBPACK_IMPORTED_MODULE_4__utils_draggable__["a" /* Draggable */](this.$element, {
            handlerClass: this.gridster.draggableOptions.handlerClass
        });
        var dragStartSub = draggable.dragStart
            .subscribe(function (event) {
            _this.gridster.onStart(_this.item);
            _this.isDragging = true;
            cursorToElementPosition = event.getRelativeCoordinates(_this.$element);
        });
        var dragSub = draggable.dragMove
            .subscribe(function (event) {
            _this.$element.style.top = (event.clientY - cursorToElementPosition.y -
                _this.gridster.gridsterOffset.top - _this.gridster.gridsterRect.top) + 'px';
            _this.$element.style.left = (event.clientX - cursorToElementPosition.x -
                _this.gridster.gridsterOffset.left - _this.gridster.gridsterRect.left) + 'px';
            _this.gridster.onDrag(_this.item);
        });
        var dragStopSub = draggable.dragStop
            .subscribe(function () {
            _this.gridster.onStop(_this.item);
            _this.isDragging = false;
        });
        this.dragSubscriptions = this.dragSubscriptions.concat([dragStartSub, dragSub, dragStopSub]);
    };
    GridsterItemComponent.prototype.disableDraggable = function () {
        this.dragSubscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
        this.dragSubscriptions = [];
    };
    GridsterItemComponent.prototype.createResizeStartObject = function (direction) {
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
            top: parseInt(this.$element.style.top, 10),
            left: parseInt(this.$element.style.left, 10),
            height: parseInt(this.$element.style.height, 10),
            width: parseInt(this.$element.style.width, 10),
            minX: Math.max(this.item.x + this.item.w - this.gridster.options.maxWidth, 0),
            maxX: this.item.x + this.item.w - this.gridster.options.minWidth,
            minY: Math.max(this.item.y + this.item.h - this.gridster.options.maxHeight, 0),
            maxY: this.item.y + this.item.h - this.gridster.options.minHeight,
            minW: this.gridster.options.minWidth,
            maxW: Math.min(this.gridster.options.maxWidth, (this.gridster.options.direction === 'vertical' && direction.indexOf('w') < 0) ?
                this.gridster.options.lanes - this.item.x : this.gridster.options.maxWidth, direction.indexOf('w') >= 0 ?
                this.item.x + this.item.w : this.gridster.options.maxWidth),
            minH: this.gridster.options.minHeight,
            maxH: Math.min(this.gridster.options.maxHeight, (this.gridster.options.direction === 'horizontal' && direction.indexOf('n') < 0) ?
                this.gridster.options.lanes - this.item.y : this.gridster.options.maxHeight, direction.indexOf('n') >= 0 ?
                this.item.y + this.item.h : this.gridster.options.maxHeight),
            scrollLeft: scrollLeft,
            scrollTop: scrollTop
        };
    };
    /**
     * Assign class for short while to prevent animation of grid item component
     * @returns {GridsterItemComponent}
     */
    GridsterItemComponent.prototype.preventAnimation = function () {
        var _this = this;
        this.$element.classList.add('no-transition');
        setTimeout(function () {
            _this.$element.classList.remove('no-transition');
        }, 500);
        return this;
    };
    GridsterItemComponent.prototype.getResizeDirection = function (handler) {
        for (var i = handler.classList.length - 1; i >= 0; i--) {
            if (handler.classList[i].match('handle-')) {
                return handler.classList[i].split('-')[1];
            }
        }
    };
    GridsterItemComponent.prototype.resizeElement = function (config) {
        // north
        if (config.direction.indexOf('n') >= 0) {
            this.resizeToNorth(config);
        }
        // west
        if (config.direction.indexOf('w') >= 0) {
            this.resizeToWest(config);
        }
        // east
        if (config.direction.indexOf('e') >= 0) {
            this.resizeToEast(config);
        }
        // south
        if (config.direction.indexOf('s') >= 0) {
            this.resizeToSouth(config);
        }
    };
    GridsterItemComponent.prototype.resizeToNorth = function (config) {
        var height = config.startData.height + config.startEvent.clientY -
            config.moveEvent.clientY - config.scrollDiffY;
        // if (this.isLessThanMinHeight(height)) { // lest than min
        if (height < (config.startData.minH * this.gridster.cellHeight)) {
            this.setMinHeight('n', config);
        }
        else if (height > (config.startData.maxH * this.gridster.cellHeight)) {
            this.setMaxHeight('n', config);
        }
        else {
            this.$element.style.top = config.position.y + 'px';
            this.$element.style.height = height + 'px';
        }
    };
    GridsterItemComponent.prototype.resizeToWest = function (config) {
        var width = config.startData.width + config.startEvent.clientX -
            config.moveEvent.clientX - config.scrollDiffX;
        // if (this.isLessThanMinWidth(width)) { // lest than min
        if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('w', config);
        }
        else if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('w', config);
        }
        else {
            this.$element.style.left = config.position.x + 'px';
            this.$element.style.width = width + 'px';
        }
    };
    GridsterItemComponent.prototype.resizeToEast = function (config) {
        var width = config.startData.width + config.moveEvent.clientX -
            config.startEvent.clientX + config.scrollDiffX;
        // if (this.isMoreThanMaxWidth(width, 'e')) {
        if (width > (config.startData.maxW * this.gridster.cellWidth)) {
            this.setMaxWidth('e', config);
        }
        else if (width < (config.startData.minW * this.gridster.cellWidth)) {
            this.setMinWidth('e', config);
        }
        else {
            this.$element.style.width = width + 'px';
        }
    };
    GridsterItemComponent.prototype.resizeToSouth = function (config) {
        var height = config.startData.height + config.moveEvent.clientY -
            config.startEvent.clientY + config.scrollDiffY;
        // if (this.isMoreThanMaxHeight(height, 's')) {
        if (height > config.startData.maxH * this.gridster.cellHeight) {
            this.setMaxHeight('s', config);
        }
        else if (height < config.startData.minH * this.gridster.cellHeight) {
            this.setMinHeight('s', config);
        }
        else {
            this.$element.style.height = height + 'px';
        }
    };
    GridsterItemComponent.prototype.setMinHeight = function (direction, config) {
        if (direction === 'n') {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
            this.$element.style.top = (config.startData.maxY * this.gridster.cellHeight) + 'px';
        }
        else {
            this.$element.style.height = (config.startData.minH * this.gridster.cellHeight) + 'px';
        }
    };
    GridsterItemComponent.prototype.setMinWidth = function (direction, config) {
        if (direction === 'w') {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
            this.$element.style.left = (config.startData.maxX * this.gridster.cellWidth) + 'px';
        }
        else {
            this.$element.style.width = (config.startData.minW * this.gridster.cellWidth) + 'px';
        }
    };
    GridsterItemComponent.prototype.setMaxHeight = function (direction, config) {
        if (direction === 'n') {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
            this.$element.style.top = (config.startData.minY * this.gridster.cellHeight) + 'px';
        }
        else {
            this.$element.style.height = (config.startData.maxH * this.gridster.cellHeight) + 'px';
        }
    };
    GridsterItemComponent.prototype.setMaxWidth = function (direction, config) {
        if (direction === 'w') {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
            this.$element.style.left = (config.startData.minX * this.gridster.cellWidth) + 'px';
        }
        else {
            this.$element.style.width = (config.startData.maxW * this.gridster.cellWidth) + 'px';
        }
    };
    GridsterItemComponent.ctorParameters = function () { return [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* ChangeDetectorRef */] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["H" /* ElementRef */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Inject */], args: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["H" /* ElementRef */]] }] }, { type: __WEBPACK_IMPORTED_MODULE_2__gridster_service__["a" /* GridsterService */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Host */] }] }]; };
    return GridsterItemComponent;
}());
//# sourceMappingURL=gridster-item.component.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_mergeMap__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_mergeMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_mergeMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_switchMap__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_switchMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_takeUntil__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_takeUntil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_takeUntil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__gridster_prototype_service__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__gridList_GridListItem__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils_draggable__ = __webpack_require__(235);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridsterItemPrototypeDirective; });











var GridsterItemPrototypeDirective = (function () {
    function GridsterItemPrototypeDirective(elementRef, gridsterPrototype) {
        this.elementRef = elementRef;
        this.gridsterPrototype = gridsterPrototype;
        this.drop = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.start = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.cancel = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.enter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.out = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.config = {};
        this.x = 0;
        this.y = 0;
        this.autoSize = false;
        this.isDragging = false;
        this.subscribtions = [];
        this.item = (new __WEBPACK_IMPORTED_MODULE_9__gridList_GridListItem__["a" /* GridListItem */]()).setFromGridsterItemPrototype(this);
    }
    GridsterItemPrototypeDirective.prototype.ngOnInit = function () {
        this.enableDragDrop();
    };
    GridsterItemPrototypeDirective.prototype.ngOnDestroy = function () {
        this.subscribtions.forEach(function (sub) {
            sub.unsubscribe();
        });
    };
    GridsterItemPrototypeDirective.prototype.onDrop = function (gridster) {
        if (!this.config.helper) {
            this.$element.parentNode.removeChild(this.$element);
        }
        this.drop.emit({
            item: this.item,
            gridster: gridster
        });
    };
    GridsterItemPrototypeDirective.prototype.onCancel = function () {
        this.cancel.emit({ item: this.item });
    };
    GridsterItemPrototypeDirective.prototype.onEnter = function (gridster) {
        this.enter.emit({
            item: this.item,
            gridster: gridster
        });
    };
    GridsterItemPrototypeDirective.prototype.onOver = function (gridster) { };
    GridsterItemPrototypeDirective.prototype.onOut = function (gridster) {
        this.out.emit({
            item: this.item,
            gridster: gridster
        });
    };
    GridsterItemPrototypeDirective.prototype.enableDragDrop = function () {
        var _this = this;
        var cursorToElementPosition;
        var draggable = new __WEBPACK_IMPORTED_MODULE_10__utils_draggable__["a" /* Draggable */](this.elementRef.nativeElement);
        var dragStartSub = draggable.dragStart
            .subscribe(function (event) {
            _this.$element = _this.provideDragElement();
            _this.updateParentElementData();
            _this.onStart();
            cursorToElementPosition = event.getRelativeCoordinates(_this.$element);
        });
        var dragSub = draggable.dragMove
            .subscribe(function (event) {
            _this.$element.style.top = (event.clientY - cursorToElementPosition.y - _this.parentRect.top) + 'px';
            _this.$element.style.left = (event.clientX - cursorToElementPosition.x - _this.parentRect.left) + 'px';
            _this.onDrag();
        });
        var dragStopSub = draggable.dragStop
            .subscribe(function () {
            _this.onStop();
            _this.$element = null;
        });
        var scrollSub = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].fromEvent(document, 'scroll')
            .subscribe(function () {
            if (_this.$element) {
                _this.updateParentElementData();
            }
        });
        this.subscribtions = this.subscribtions.concat([dragStartSub, dragSub, dragStopSub, scrollSub]);
    };
    GridsterItemPrototypeDirective.prototype.updateParentElementData = function () {
        this.parentRect = this.$element.parentElement.getBoundingClientRect();
        this.parentOffset = {
            left: this.$element.parentElement.offsetLeft,
            top: this.$element.parentElement.offsetTop
        };
    };
    GridsterItemPrototypeDirective.prototype.onStart = function () {
        this.isDragging = true;
        this.$element.style.pointerEvents = 'none';
        this.$element.style.position = 'absolute';
        this.gridsterPrototype.dragItemStart(this);
        this.start.emit({ item: this.item });
    };
    GridsterItemPrototypeDirective.prototype.onDrag = function () {
        this.gridsterPrototype.updatePrototypePosition(this);
    };
    GridsterItemPrototypeDirective.prototype.onStop = function () {
        this.gridsterPrototype.dragItemStop(this);
        this.isDragging = false;
        this.$element.style.pointerEvents = 'auto';
        this.$element.style.position = '';
        this.$element.style.top = '';
        this.$element.style.left = '';
        if (this.config.helper) {
            this.$element.parentNode.removeChild(this.$element);
        }
    };
    GridsterItemPrototypeDirective.prototype.provideDragElement = function () {
        var dragElement = this.elementRef.nativeElement;
        if (this.config.helper) {
            dragElement = (dragElement).cloneNode(true);
            document.body.appendChild(this.fixStylesForBodyHelper(dragElement));
        }
        else {
            this.fixStylesForRelativeElement(dragElement);
        }
        return dragElement;
    };
    GridsterItemPrototypeDirective.prototype.fixStylesForRelativeElement = function (el) {
        if (window.getComputedStyle(el).position === 'absolute') {
            return el;
        }
        var containerRect = el.parentElement.getBoundingClientRect();
        var rect = this.elementRef.nativeElement.getBoundingClientRect();
        el.style.position = 'absolute';
        el.style.left = (rect.left - containerRect.left) + 'px';
        el.style.top = (rect.top - containerRect.top) + 'px';
        return el;
    };
    /**
     * When element is cloned and append to body it should have position absolute and coords set by original
     * relative prototype element position.
     * @param el
     * @returns {HTMLElement}
     */
    GridsterItemPrototypeDirective.prototype.fixStylesForBodyHelper = function (el) {
        var bodyRect = document.body.getBoundingClientRect();
        var rect = this.elementRef.nativeElement.getBoundingClientRect();
        el.style.position = 'absolute';
        el.style.left = (rect.left - bodyRect.left) + 'px';
        el.style.top = (rect.top - bodyRect.top) + 'px';
        return el;
    };
    GridsterItemPrototypeDirective.ctorParameters = function () { return [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["H" /* ElementRef */] }, { type: __WEBPACK_IMPORTED_MODULE_8__gridster_prototype_service__["a" /* GridsterPrototypeService */] }]; };
    return GridsterItemPrototypeDirective;
}());
//# sourceMappingURL=gridster-item-prototype.directive.js.map

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_takeUntil__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_takeUntil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_takeUntil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gridster_service__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__gridster_prototype_gridster_prototype_service__ = __webpack_require__(63);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridsterComponent; });






var GridsterComponent = (function () {
    function GridsterComponent(elementRef, gridster, cdr, gridsterPrototype) {
        this.cdr = cdr;
        this.gridsterPrototype = gridsterPrototype;
        this.gridsterPositionChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.resize = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* EventEmitter */]();
        this.isDragging = false;
        this.isResizing = false;
        this.subscribtions = [];
        this.gridster = gridster;
        this.gridster.gridsterChange = this.gridsterPositionChange;
        this.$el = elementRef.nativeElement;
    }
    GridsterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gridster.init(this.options, this.draggableOptions, this);
        var scrollSub = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].fromEvent(document, 'scroll')
            .subscribe(function () { return _this.updateGridsterElementData(); });
        this.subscribtions.push(scrollSub);
    };
    GridsterComponent.prototype.ngAfterViewInit = function () {
        this.gridster.start(this.$el);
        this.updateGridsterElementData();
        this.connectGridsterPrototype();
        this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
        // detectChanges is required because gridster.start changes values uses in template
        // this.cdr.detectChanges();
        // this.cdr.detach();
    };
    GridsterComponent.prototype.ngOnDestroy = function () {
        this.subscribtions.forEach(function (sub) {
            sub.unsubscribe();
        });
    };
    GridsterComponent.prototype.updateGridsterElementData = function () {
        this.gridster.gridsterRect = this.$el.getBoundingClientRect();
        this.gridster.gridsterOffset = {
            left: this.$el.offsetLeft,
            top: this.$el.offsetTop
        };
    };
    /**
     * Connect gridster prototype item to gridster dragging hooks (onStart, onDrag, onStop).
     */
    GridsterComponent.prototype.connectGridsterPrototype = function () {
        var _this = this;
        var isEntered = false;
        this.gridsterPrototype.observeDropOut(this.gridster)
            .subscribe();
        var dropOverObservable = this.gridsterPrototype.observeDropOver(this.gridster)
            .publish();
        this.gridsterPrototype.observeDragOver(this.gridster).dragOver
            .subscribe(function (prototype) {
            if (!isEntered) {
                return;
            }
            _this.gridster.onDrag(prototype.item);
        });
        this.gridsterPrototype.observeDragOver(this.gridster).dragEnter
            .subscribe(function (prototype) {
            isEntered = true;
            _this.gridster.items.push(prototype.item);
            _this.gridster.onStart(prototype.item);
        });
        this.gridsterPrototype.observeDragOver(this.gridster).dragOut
            .subscribe(function (prototype) {
            if (!isEntered) {
                return;
            }
            _this.gridster.onDragOut(prototype.item);
            isEntered = false;
        });
        dropOverObservable
            .subscribe(function (prototype) {
            if (!isEntered) {
                return;
            }
            _this.gridster.onStop(prototype.item);
            var idx = _this.gridster.items.indexOf(prototype.item);
            _this.gridster.items.splice(idx, 1);
            isEntered = false;
        });
        dropOverObservable.connect();
    };
    /**
     * Change gridster config option and rebuild
     * @param {string} name
     * @param {any} value
     * @return {GridsterComponent}
     */
    GridsterComponent.prototype.setOption = function (name, value) {
        if (name === 'dragAndDrop') {
            if (value) {
                this.enableDraggable();
            }
            else {
                this.disableDraggable();
            }
        }
        if (name === 'resizable') {
            if (value) {
                this.enableResizable();
            }
            else {
                this.disableResizable();
            }
        }
        if (name === 'lanes') {
            this.gridster.options.lanes = value;
        }
        if (name === 'direction') {
            this.gridster.options.direction = value;
        }
        this.gridster.gridList.setOption(name, value);
        return this;
    };
    GridsterComponent.prototype.reload = function () {
        this.gridster.reflow();
        return this;
    };
    GridsterComponent.prototype.enableDraggable = function () {
        this.gridster.options.dragAndDrop = true;
        this.gridster.items.forEach(function (item) {
            item.itemComponent.enableDragDrop();
        });
    };
    GridsterComponent.prototype.disableDraggable = function () {
        this.gridster.options.dragAndDrop = false;
        this.gridster.items.forEach(function (item) {
            item.itemComponent.disableDraggable();
        });
    };
    GridsterComponent.prototype.enableResizable = function () {
        this.gridster.options.resizable = true;
        this.gridster.items.forEach(function (item) {
            item.itemComponent.enableResizable();
        });
    };
    GridsterComponent.prototype.disableResizable = function () {
        this.gridster.options.resizable = false;
        this.gridster.items.forEach(function (item) {
            item.itemComponent.disableResizable();
        });
    };
    GridsterComponent.ctorParameters = function () { return [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["H" /* ElementRef */] }, { type: __WEBPACK_IMPORTED_MODULE_4__gridster_service__["a" /* GridsterService */] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* ChangeDetectorRef */] }, { type: __WEBPACK_IMPORTED_MODULE_5__gridster_prototype_gridster_prototype_service__["a" /* GridsterPrototypeService */] }]; };
    return GridsterComponent;
}());
//# sourceMappingURL=gridster.component.js.map

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_fromEvent__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_fromEvent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_fromEvent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_takeUntil__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_takeUntil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_takeUntil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_filter__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_merge__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_merge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_merge__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__DraggableEvent__ = __webpack_require__(363);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Draggable; });








var Draggable = (function () {
    function Draggable(element, config) {
        if (config === void 0) { config = {}; }
        this.mousemove = __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].merge(__WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].fromEvent(document, 'mousemove'), __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].fromEvent(document, 'touchmove', { passive: true }));
        this.mouseup = __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].merge(__WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].fromEvent(document, 'mouseup'), __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].fromEvent(document, 'touchend'), __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].fromEvent(document, 'touchcancel'));
        this.config = {
            handlerClass: null
        };
        this.element = element;
        this.mousedown = __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].merge(__WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].fromEvent(element, 'mousedown'), __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].fromEvent(element, 'touchstart'));
        this.config.handlerClass = config.handlerClass;
        this.dragStart = this.createDragStartObservable().share();
        this.dragMove = this.createDragMoveObservable(this.dragStart);
        this.dragStop = this.createDragStopObservable(this.dragStart);
    }
    Draggable.prototype.createDragStartObservable = function () {
        var _this = this;
        return this.mousedown
            .map(function (md) { return new __WEBPACK_IMPORTED_MODULE_7__DraggableEvent__["a" /* DraggableEvent */](md); })
            .filter(function (event) { return _this.isDragingByHandler(event); })
            .do(function (e) { return e.pauseEvent(); })
            .switchMap(function (startEvent) {
            return _this.mousemove
                .map(function (mm) { return new __WEBPACK_IMPORTED_MODULE_7__DraggableEvent__["a" /* DraggableEvent */](mm); })
                .filter(function (moveEvent) { return _this.inRange(startEvent, moveEvent, 5); })
                .map(function () { return startEvent; })
                .takeUntil(_this.mouseup)
                .take(1);
        });
    };
    Draggable.prototype.createDragMoveObservable = function (dragStart) {
        var _this = this;
        return dragStart
            .flatMap(function () {
            return _this.mousemove
                .skip(1)
                .map(function (mm) { return new __WEBPACK_IMPORTED_MODULE_7__DraggableEvent__["a" /* DraggableEvent */](mm); })
                .takeUntil(_this.mouseup);
        })
            .filter(function (val) { return !!val; });
    };
    Draggable.prototype.createDragStopObservable = function (dragStart) {
        var _this = this;
        return dragStart
            .flatMap(function () {
            return _this.mousemove
                .takeUntil(_this.mouseup)
                .last();
        });
    };
    Draggable.prototype.isDragingByHandler = function (event) {
        return !this.config.handlerClass ||
            (this.config.handlerClass && this.hasElementWithClass(this.config.handlerClass, event.target));
    };
    Draggable.prototype.inRange = function (startEvent, moveEvent, range) {
        return Math.abs(moveEvent.clientX - startEvent.clientX) > range ||
            Math.abs(moveEvent.clientY - startEvent.clientY) > range;
    };
    Draggable.prototype.hasElementWithClass = function (className, target) {
        while (target !== this.element) {
            if (target.classList.contains(className)) {
                return true;
            }
            target = target.parentElement;
        }
        return false;
    };
    Draggable.prototype.pauseEvent = function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
    };
    return Draggable;
}());
//# sourceMappingURL=draggable.js.map

/***/ }),

/***/ 281:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 281;


/***/ }),

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gendir_app_app_module_ngfactory__ = __webpack_require__(349);




if (__WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["a" /* platformBrowser */])().bootstrapModuleFactory(__WEBPACK_IMPORTED_MODULE_3__gendir_app_app_module_ngfactory__["a" /* AppModuleNgFactory */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 347:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styles; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */
var styles = ['h1[_ngcontent-%COMP%] {\n    font-size: 22px;\n    padding: 0 20px;\n    height: 50px;\n    margin: 0;\n}\n\n.toolbar[_ngcontent-%COMP%] {\n    position: relative;\n    padding: 0 20px;\n}\n\n.widgetbar[_ngcontent-%COMP%] {\n    width: 100%;\n    position: relative;\n    height: 100px;\n    padding: 10px 0;\n}\n\n.main-content[_ngcontent-%COMP%] {\n    position: absolute;\n    top: 200px;\n    left: 0;\n    width: 100%;\n}\n\n.panel-heading[_ngcontent-%COMP%] {\n    border-bottom: 1px solid #F0F0F0;\n    display: inline-block;\n    position: relative;\n    width: 100%;\n    top: 0;\n}\n.panel-heading[_ngcontent-%COMP%]   .panel-title[_ngcontent-%COMP%] {\n    padding: 10px;\n    margin: 0;\n}\n\n.panel-body[_ngcontent-%COMP%] {\n    overflow: auto;\n    padding: 0 10px 10px;\n    position: absolute;\n    top: 37px;\n    bottom: 0;\n}\n\n.gridster-item-prototype[_ngcontent-%COMP%] {\n    display: block;\n    background-color: #afafaf;\n    position: relative;\n    float: left;\n    z-index: 99;\n    text-align: center;\n    font-weight: bold;\n    margin: 5px;\n    width: 80px;\n    height: 60px;\n\n}\n\n.gridster-item-prototype.is-over[_ngcontent-%COMP%]   .gridster-item-inner[_ngcontent-%COMP%] {\n\n    visibility: visible;\n}\n\n.gridster-item-inner[_ngcontent-%COMP%] {\n    position: absolute;\n    top:0;\n    left: 0;\n    overflow: auto;\n    width: 80px;\n    height: 60px;\n    visibility: hidden;\n\n    -webkit-transition: width 0.2s ease-in-out, height 0.2s ease-in-out;\n    transition: width 0.2s ease-in-out, height 0.2s ease-in-out;\n}'];
//# sourceMappingURL=app.component.css.shim.ngstyle.js.map

/***/ }),

/***/ 348:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_app_component__ = __webpack_require__(359);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core_src_linker_view__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core_src_metadata_view__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core_src_linker_view_type__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core_src_change_detection_constants__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_core_src_linker_component_factory__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component_css_shim_ngstyle__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_gridster_gridster_item_gridster_item_component__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__gridster_gridster_item_gridster_item_component_ngfactory__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_core_src_linker_view_container__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_core_src_change_detection_change_detection_util__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_core_src_linker_query_list__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__gendir_node_modules_angular_forms_src_directives_checkbox_value_accessor_ngfactory__ = __webpack_require__(354);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__gendir_node_modules_angular_forms_src_directives_ng_model_ngfactory__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__gendir_node_modules_angular_forms_src_directives_ng_control_status_ngfactory__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__gendir_node_modules_angular_forms_src_directives_default_value_accessor_ngfactory__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__gendir_node_modules_angular_forms_src_directives_radio_control_value_accessor_ngfactory__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__gridster_gridster_prototype_gridster_item_prototype_directive_ngfactory__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__app_gridster_gridster_component__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__app_gridster_gridster_service__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__gridster_gridster_component_ngfactory__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__gendir_node_modules_angular_common_src_directives_ng_for_ngfactory__ = __webpack_require__(353);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__angular_forms_src_directives_radio_control_value_accessor__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__app_gridster_gridster_prototype_gridster_prototype_service__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__angular_core_src_linker_template_ref__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__angular_core_src_change_detection_differs_iterable_differs__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__angular_forms_src_directives_checkbox_value_accessor__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__angular_forms_src_directives_control_value_accessor__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__angular_forms_src_directives_ng_model__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__angular_forms_src_directives_ng_control__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__angular_forms_src_directives_ng_control_status__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__angular_forms_src_directives_default_value_accessor__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__app_gridster_gridster_prototype_gridster_item_prototype_directive__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__angular_common_src_directives_ng_for__ = __webpack_require__(119);
/* unused harmony export Wrapper_AppComponent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponentNgFactory; });
/* unused harmony export View_AppComponent0 */
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




































var Wrapper_AppComponent = (function () {
    function Wrapper_AppComponent() {
        this._changed = false;
        this.context = new __WEBPACK_IMPORTED_MODULE_0__app_app_component__["a" /* AppComponent */]();
    }
    Wrapper_AppComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_AppComponent.prototype.ngOnDestroy = function () {
    };
    Wrapper_AppComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        return changed;
    };
    Wrapper_AppComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_AppComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        if ((eventName == 'window:resize')) {
            var pd_sub_0 = (this.context.onResize($event) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    Wrapper_AppComponent.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_AppComponent;
}());
var renderType_AppComponent_Host = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderComponentType"]('', 0, __WEBPACK_IMPORTED_MODULE_3__angular_core_src_metadata_view__["b" /* ViewEncapsulation */].None, [], {});
var View_AppComponent_Host0 = (function (_super) {
    __extends(View_AppComponent_Host0, _super);
    function View_AppComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_AppComponent_Host0, renderType_AppComponent_Host, __WEBPACK_IMPORTED_MODULE_4__angular_core_src_linker_view_type__["a" /* ViewType */].HOST, viewUtils, parentView, parentIndex, parentElement, __WEBPACK_IMPORTED_MODULE_5__angular_core_src_change_detection_constants__["b" /* ChangeDetectorStatus */].CheckAlways);
    }
    View_AppComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["selectOrCreateRenderHostElement"](this.renderer, 'app-root', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], rootSelector, null);
        this.compView_0 = new View_AppComponent0(this.viewUtils, this, 0, this._el_0);
        this._AppComponent_0_3 = new Wrapper_AppComponent();
        this.compView_0.create(this._AppComponent_0_3.context);
        var disposable_0 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_0, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'resize', 'window'), this.eventHandler(this.handleEvent_0));
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), [disposable_0]);
        return new __WEBPACK_IMPORTED_MODULE_6__angular_core_src_linker_component_factory__["a" /* ComponentRef_ */](0, this, this._el_0, this._AppComponent_0_3.context);
    };
    View_AppComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === __WEBPACK_IMPORTED_MODULE_0__app_app_component__["a" /* AppComponent */]) && (0 === requestNodeIndex))) {
            return this._AppComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_AppComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._AppComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        this.compView_0.internalDetectChanges(throwOnChange);
    };
    View_AppComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
    };
    View_AppComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_AppComponent_Host0.prototype.handleEvent_0 = function (eventName, $event) {
        this.compView_0.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._AppComponent_0_3.handleEvent(eventName, $event) && result);
        return result;
    };
    return View_AppComponent_Host0;
}(__WEBPACK_IMPORTED_MODULE_1__angular_core_src_linker_view__["a" /* AppView */]));
var AppComponentNgFactory = new __WEBPACK_IMPORTED_MODULE_6__angular_core_src_linker_component_factory__["b" /* ComponentFactory */]('app-root', View_AppComponent_Host0, __WEBPACK_IMPORTED_MODULE_0__app_app_component__["a" /* AppComponent */]);
var styles_AppComponent = [__WEBPACK_IMPORTED_MODULE_7__app_component_css_shim_ngstyle__["a" /* styles */]];
var View_AppComponent1 = (function (_super) {
    __extends(View_AppComponent1, _super);
    function View_AppComponent1(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_AppComponent1, renderType_AppComponent, __WEBPACK_IMPORTED_MODULE_4__angular_core_src_linker_view_type__["a" /* ViewType */].EMBEDDED, viewUtils, parentView, parentIndex, parentElement, __WEBPACK_IMPORTED_MODULE_5__angular_core_src_change_detection_constants__["b" /* ChangeDetectorStatus */].CheckAlways, declaredViewContainer);
        this._expr_42 = __WEBPACK_IMPORTED_MODULE_11__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_43 = __WEBPACK_IMPORTED_MODULE_11__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_44 = __WEBPACK_IMPORTED_MODULE_11__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_45 = __WEBPACK_IMPORTED_MODULE_11__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
    }
    View_AppComponent1.prototype.createInternal = function (rootSelector) {
        this._el_0 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, null, 'gridster-item', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this.compView_0 = new __WEBPACK_IMPORTED_MODULE_9__gridster_gridster_item_gridster_item_component_ngfactory__["a" /* View_GridsterItemComponent0 */](this.viewUtils, this, 0, this._el_0);
        this._GridsterItemComponent_0_3 = new __WEBPACK_IMPORTED_MODULE_9__gridster_gridster_item_gridster_item_component_ngfactory__["b" /* Wrapper_GridsterItemComponent */](this.compView_0.ref, new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_0), this.parentView._GridsterService_80_3);
        this._text_1 = this.renderer.createText(null, '\n\n            ', null);
        this._el_2 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, null, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'panel-heading'), null);
        this._text_3 = this.renderer.createText(this._el_2, '\n                ', null);
        this._el_4 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_2, 'h5', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'panel-title'), null);
        this._text_5 = this.renderer.createText(this._el_4, '', null);
        this._text_6 = this.renderer.createText(this._el_2, '\n            ', null);
        this._text_7 = this.renderer.createText(null, '\n\n            ', null);
        this._el_8 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, null, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'panel-body'), null);
        this._text_9 = this.renderer.createText(this._el_8, '\n                ', null);
        this._el_10 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_8, 'p', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_11 = this.renderer.createText(this._el_10, '\n                    ', null);
        this._el_12 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_10, 'button', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_13 = this.renderer.createText(this._el_12, 'width +', null);
        this._text_14 = this.renderer.createText(this._el_10, '\n                    ', null);
        this._el_15 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_10, 'button', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_16 = this.renderer.createText(this._el_15, 'width -', null);
        this._text_17 = this.renderer.createText(this._el_10, '\n                    ', null);
        this._el_18 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_10, 'button', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_19 = this.renderer.createText(this._el_18, 'height +', null);
        this._text_20 = this.renderer.createText(this._el_10, '\n                    ', null);
        this._el_21 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_10, 'button', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_22 = this.renderer.createText(this._el_21, 'height -', null);
        this._text_23 = this.renderer.createText(this._el_10, '\n                ', null);
        this._text_24 = this.renderer.createText(this._el_8, '\n                ', null);
        this._el_25 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_8, 'p', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_26 = this.renderer.createText(this._el_25, '\n                    ', null);
        this._el_27 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_25, 'button', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_28 = this.renderer.createText(this._el_27, 'remove', null);
        this._text_29 = this.renderer.createText(this._el_25, '\n                ', null);
        this._text_30 = this.renderer.createText(this._el_8, '\n                ', null);
        this._el_31 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_8, 'p', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_32 = this.renderer.createText(this._el_31, '', null);
        this._el_33 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_31, 'br', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_34 = this.renderer.createText(this._el_31, '', null);
        this._text_35 = this.renderer.createText(this._el_8, '\n                ', null);
        this._el_36 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_8, 'p', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_37 = this.renderer.createText(this._el_36, '', null);
        this._text_38 = this.renderer.createText(this._el_8, '\n            ', null);
        this._text_39 = this.renderer.createText(null, '\n\n        ', null);
        this.compView_0.create(this._GridsterItemComponent_0_3.context);
        var disposable_0 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_0, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](8, 'xChange', null, 'yChange', null, 'wChange', null, 'hChange', null), this.eventHandler(this.handleEvent_0));
        this._GridsterItemComponent_0_3.subscribe(this, this.eventHandler(this.handleEvent_0), true, true, true, true);
        var disposable_1 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_12, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'click', null), this.eventHandler(this.handleEvent_12));
        var disposable_2 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_15, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'click', null), this.eventHandler(this.handleEvent_15));
        var disposable_3 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_18, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'click', null), this.eventHandler(this.handleEvent_18));
        var disposable_4 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_21, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'click', null), this.eventHandler(this.handleEvent_21));
        var disposable_5 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_27, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'click', null), this.eventHandler(this.handleEvent_27));
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._text_6,
            this._text_7,
            this._el_8,
            this._text_9,
            this._el_10,
            this._text_11,
            this._el_12,
            this._text_13,
            this._text_14,
            this._el_15,
            this._text_16,
            this._text_17,
            this._el_18,
            this._text_19,
            this._text_20,
            this._el_21,
            this._text_22,
            this._text_23,
            this._text_24,
            this._el_25,
            this._text_26,
            this._el_27,
            this._text_28,
            this._text_29,
            this._text_30,
            this._el_31,
            this._text_32,
            this._el_33,
            this._text_34,
            this._text_35,
            this._el_36,
            this._text_37,
            this._text_38,
            this._text_39
        ]), [
            disposable_0,
            disposable_1,
            disposable_2,
            disposable_3,
            disposable_4,
            disposable_5
        ]);
        return null;
    };
    View_AppComponent1.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === __WEBPACK_IMPORTED_MODULE_8__app_gridster_gridster_item_gridster_item_component__["a" /* GridsterItemComponent */]) && ((0 <= requestNodeIndex) && (requestNodeIndex <= 39)))) {
            return this._GridsterItemComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_AppComponent1.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_0_0_0 = this.context.$implicit.x;
        this._GridsterItemComponent_0_3.check_x(currVal_0_0_0, throwOnChange, false);
        var currVal_0_0_1 = this.context.$implicit.y;
        this._GridsterItemComponent_0_3.check_y(currVal_0_0_1, throwOnChange, false);
        var currVal_0_0_2 = this.context.$implicit.w;
        this._GridsterItemComponent_0_3.check_w(currVal_0_0_2, throwOnChange, false);
        var currVal_0_0_3 = this.context.$implicit.h;
        this._GridsterItemComponent_0_3.check_h(currVal_0_0_3, throwOnChange, false);
        if (this._GridsterItemComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange)) {
            this.compView_0.markAsCheckOnce();
        }
        this._GridsterItemComponent_0_3.checkHost(this, this.compView_0, this._el_0, throwOnChange);
        var currVal_42 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["inlineInterpolate"](1, '', this.context.$implicit.title, '');
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_42, currVal_42)) {
            this.renderer.setText(this._text_5, currVal_42);
            this._expr_42 = currVal_42;
        }
        var currVal_43 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["inlineInterpolate"](2, '\n                    Position: ', this.context.$implicit.x, ' x ', this.context.$implicit.y, '');
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_43, currVal_43)) {
            this.renderer.setText(this._text_32, currVal_43);
            this._expr_43 = currVal_43;
        }
        var currVal_44 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["inlineInterpolate"](2, '\n                    Size: ', this.context.$implicit.w, ' x ', this.context.$implicit.h, '\n                ');
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_44, currVal_44)) {
            this.renderer.setText(this._text_34, currVal_44);
            this._expr_44 = currVal_44;
        }
        var currVal_45 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["inlineInterpolate"](1, '', this.context.$implicit.content, '');
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_45, currVal_45)) {
            this.renderer.setText(this._text_37, currVal_45);
            this._expr_45 = currVal_45;
        }
        this.compView_0.internalDetectChanges(throwOnChange);
        if (!throwOnChange) {
            if ((this.numberOfChecks === 0)) {
                this._GridsterItemComponent_0_3.context.ngAfterViewInit();
            }
        }
    };
    View_AppComponent1.prototype.destroyInternal = function () {
        this.compView_0.destroy();
        this._GridsterItemComponent_0_3.ngOnDestroy();
    };
    View_AppComponent1.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_AppComponent1.prototype.visitProjectableNodesInternal = function (nodeIndex, ngContentIndex, cb, ctx) {
        if (((nodeIndex == 0) && (ngContentIndex == 0))) {
            cb(this._text_1, ctx);
            cb(this._el_2, ctx);
            cb(this._text_7, ctx);
            cb(this._el_8, ctx);
            cb(this._text_39, ctx);
        }
    };
    View_AppComponent1.prototype.handleEvent_0 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'xChange')) {
            var pd_sub_0 = ((this.context.$implicit.x = $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'yChange')) {
            var pd_sub_1 = ((this.context.$implicit.y = $event) !== false);
            result = (pd_sub_1 && result);
        }
        if ((eventName == 'wChange')) {
            var pd_sub_2 = ((this.context.$implicit.w = $event) !== false);
            result = (pd_sub_2 && result);
        }
        if ((eventName == 'hChange')) {
            var pd_sub_3 = ((this.context.$implicit.h = $event) !== false);
            result = (pd_sub_3 && result);
        }
        return result;
    };
    View_AppComponent1.prototype.handleEvent_12 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.setWidth(this.context.$implicit, (this.context.$implicit.w + 1), $event) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_AppComponent1.prototype.handleEvent_15 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.setWidth(this.context.$implicit, (this.context.$implicit.w - 1), $event) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_AppComponent1.prototype.handleEvent_18 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.setHeight(this.context.$implicit, (this.context.$implicit.h + 1), $event) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_AppComponent1.prototype.handleEvent_21 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.setHeight(this.context.$implicit, (this.context.$implicit.h - 1), $event) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_AppComponent1.prototype.handleEvent_27 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.remove($event, this.context.index, this.parentView._GridsterComponent_80_4.context) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_AppComponent1;
}(__WEBPACK_IMPORTED_MODULE_1__angular_core_src_linker_view__["a" /* AppView */]));
var renderType_AppComponent = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderComponentType"]('', 0, __WEBPACK_IMPORTED_MODULE_3__angular_core_src_metadata_view__["b" /* ViewEncapsulation */].Emulated, styles_AppComponent, {});
var View_AppComponent0 = (function (_super) {
    __extends(View_AppComponent0, _super);
    function View_AppComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_AppComponent0, renderType_AppComponent, __WEBPACK_IMPORTED_MODULE_4__angular_core_src_linker_view_type__["a" /* ViewType */].COMPONENT, viewUtils, parentView, parentIndex, parentElement, __WEBPACK_IMPORTED_MODULE_5__angular_core_src_change_detection_constants__["b" /* ChangeDetectorStatus */].CheckAlways);
        this._expr_117 = __WEBPACK_IMPORTED_MODULE_11__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_118 = __WEBPACK_IMPORTED_MODULE_11__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_119 = __WEBPACK_IMPORTED_MODULE_11__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._map_120 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["pureProxy1"](function (p0) {
            return { helper: p0 };
        });
        this._map_121 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["pureProxy1"](function (p0) {
            return { helper: p0 };
        });
        this._map_122 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["pureProxy1"](function (p0) {
            return { helper: p0 };
        });
    }
    View_AppComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._viewQuery_GridsterComponent_0 = new __WEBPACK_IMPORTED_MODULE_13__angular_core_src_linker_query_list__["a" /* QueryList */]();
        this._el_0 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, parentRenderNode, 'h1', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_1 = this.renderer.createText(this._el_0, '', null);
        this._text_2 = this.renderer.createText(parentRenderNode, '\n', null);
        this._el_3 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, parentRenderNode, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'toolbar'), null);
        this._text_4 = this.renderer.createText(this._el_3, '\n    Lanes:\n    ', null);
        this._el_5 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'button', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_6 = this.renderer.createText(this._el_5, '-', null);
        this._text_7 = this.renderer.createText(this._el_3, '', null);
        this._el_8 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'button', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_9 = this.renderer.createText(this._el_8, '+', null);
        this._text_10 = this.renderer.createText(this._el_3, '\n\n    ', null);
        this._el_11 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'button', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_12 = this.renderer.createText(this._el_11, '\n        Add widget without data\n    ', null);
        this._text_13 = this.renderer.createText(this._el_3, '\n\n    ', null);
        this._el_14 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'input', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, 'type', 'checkbox', 'value', 'true'), null);
        this._CheckboxControlValueAccessor_14_3 = new __WEBPACK_IMPORTED_MODULE_14__gendir_node_modules_angular_forms_src_directives_checkbox_value_accessor_ngfactory__["a" /* Wrapper_CheckboxControlValueAccessor */](this.renderer, new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_14));
        this._NG_VALUE_ACCESSOR_14_4 = [this._CheckboxControlValueAccessor_14_3.context];
        this._NgModel_14_5 = new __WEBPACK_IMPORTED_MODULE_15__gendir_node_modules_angular_forms_src_directives_ng_model_ngfactory__["a" /* Wrapper_NgModel */](null, null, null, this._NG_VALUE_ACCESSOR_14_4);
        this._NgControl_14_6 = this._NgModel_14_5.context;
        this._NgControlStatus_14_7 = new __WEBPACK_IMPORTED_MODULE_16__gendir_node_modules_angular_forms_src_directives_ng_control_status_ngfactory__["a" /* Wrapper_NgControlStatus */](this._NgControl_14_6);
        this._text_15 = this.renderer.createText(this._el_3, ' Draggable\n\n    ', null);
        this._el_16 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'input', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, 'type', 'checkbox', 'value', 'true'), null);
        this._CheckboxControlValueAccessor_16_3 = new __WEBPACK_IMPORTED_MODULE_14__gendir_node_modules_angular_forms_src_directives_checkbox_value_accessor_ngfactory__["a" /* Wrapper_CheckboxControlValueAccessor */](this.renderer, new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_16));
        this._NG_VALUE_ACCESSOR_16_4 = [this._CheckboxControlValueAccessor_16_3.context];
        this._NgModel_16_5 = new __WEBPACK_IMPORTED_MODULE_15__gendir_node_modules_angular_forms_src_directives_ng_model_ngfactory__["a" /* Wrapper_NgModel */](null, null, null, this._NG_VALUE_ACCESSOR_16_4);
        this._NgControl_16_6 = this._NgModel_16_5.context;
        this._NgControlStatus_16_7 = new __WEBPACK_IMPORTED_MODULE_16__gendir_node_modules_angular_forms_src_directives_ng_control_status_ngfactory__["a" /* Wrapper_NgControlStatus */](this._NgControl_16_6);
        this._text_17 = this.renderer.createText(this._el_3, ' Resizable\n    ', null);
        this._el_18 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'br', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_19 = this.renderer.createText(this._el_3, '\n    Direction\n    ', null);
        this._el_20 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'label', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_21 = this.renderer.createText(this._el_20, '\n        ', null);
        this._el_22 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_20, 'input', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, 'type', 'radio', 'value', 'horizontal'), null);
        this._DefaultValueAccessor_22_3 = new __WEBPACK_IMPORTED_MODULE_17__gendir_node_modules_angular_forms_src_directives_default_value_accessor_ngfactory__["a" /* Wrapper_DefaultValueAccessor */](this.renderer, new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_22));
        this._RadioControlValueAccessor_22_4 = new __WEBPACK_IMPORTED_MODULE_18__gendir_node_modules_angular_forms_src_directives_radio_control_value_accessor_ngfactory__["a" /* Wrapper_RadioControlValueAccessor */](this.renderer, new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_22), this.parentView.injectorGet(__WEBPACK_IMPORTED_MODULE_24__angular_forms_src_directives_radio_control_value_accessor__["a" /* RadioControlRegistry */], this.parentIndex), this.injector(22));
        this._NG_VALUE_ACCESSOR_22_5 = [
            this._DefaultValueAccessor_22_3.context,
            this._RadioControlValueAccessor_22_4.context
        ];
        this._NgModel_22_6 = new __WEBPACK_IMPORTED_MODULE_15__gendir_node_modules_angular_forms_src_directives_ng_model_ngfactory__["a" /* Wrapper_NgModel */](null, null, null, this._NG_VALUE_ACCESSOR_22_5);
        this._NgControl_22_7 = this._NgModel_22_6.context;
        this._NgControlStatus_22_8 = new __WEBPACK_IMPORTED_MODULE_16__gendir_node_modules_angular_forms_src_directives_ng_control_status_ngfactory__["a" /* Wrapper_NgControlStatus */](this._NgControl_22_7);
        this._text_23 = this.renderer.createText(this._el_20, 'Horizontal\n    ', null);
        this._text_24 = this.renderer.createText(this._el_3, '\n    ', null);
        this._el_25 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'label', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_26 = this.renderer.createText(this._el_25, '\n        ', null);
        this._el_27 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_25, 'input', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, 'type', 'radio', 'value', 'vertical'), null);
        this._DefaultValueAccessor_27_3 = new __WEBPACK_IMPORTED_MODULE_17__gendir_node_modules_angular_forms_src_directives_default_value_accessor_ngfactory__["a" /* Wrapper_DefaultValueAccessor */](this.renderer, new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_27));
        this._RadioControlValueAccessor_27_4 = new __WEBPACK_IMPORTED_MODULE_18__gendir_node_modules_angular_forms_src_directives_radio_control_value_accessor_ngfactory__["a" /* Wrapper_RadioControlValueAccessor */](this.renderer, new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_27), this.parentView.injectorGet(__WEBPACK_IMPORTED_MODULE_24__angular_forms_src_directives_radio_control_value_accessor__["a" /* RadioControlRegistry */], this.parentIndex), this.injector(27));
        this._NG_VALUE_ACCESSOR_27_5 = [
            this._DefaultValueAccessor_27_3.context,
            this._RadioControlValueAccessor_27_4.context
        ];
        this._NgModel_27_6 = new __WEBPACK_IMPORTED_MODULE_15__gendir_node_modules_angular_forms_src_directives_ng_model_ngfactory__["a" /* Wrapper_NgModel */](null, null, null, this._NG_VALUE_ACCESSOR_27_5);
        this._NgControl_27_7 = this._NgModel_27_6.context;
        this._NgControlStatus_27_8 = new __WEBPACK_IMPORTED_MODULE_16__gendir_node_modules_angular_forms_src_directives_ng_control_status_ngfactory__["a" /* Wrapper_NgControlStatus */](this._NgControl_27_7);
        this._text_28 = this.renderer.createText(this._el_25, 'Vertical\n    ', null);
        this._text_29 = this.renderer.createText(this._el_3, '\n    ', null);
        this._el_30 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'br', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_31 = this.renderer.createText(this._el_3, '', null);
        this._text_32 = this.renderer.createText(parentRenderNode, '\n', null);
        this._el_33 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, parentRenderNode, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'widgetbar'), null);
        this._text_34 = this.renderer.createText(this._el_33, '\n    ', null);
        this._el_35 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_33, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, 'class', 'gridster-item-prototype', 'gridsterItemPrototype', ''), null);
        this._GridsterItemPrototypeDirective_35_3 = new __WEBPACK_IMPORTED_MODULE_19__gridster_gridster_prototype_gridster_item_prototype_directive_ngfactory__["a" /* Wrapper_GridsterItemPrototypeDirective */](new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_35), this.parentView.injectorGet(__WEBPACK_IMPORTED_MODULE_25__app_gridster_gridster_prototype_gridster_prototype_service__["a" /* GridsterPrototypeService */], this.parentIndex));
        this._text_36 = this.renderer.createText(this._el_35, '\n        Drag me (clone)', null);
        this._el_37 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_35, 'br', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_38 = this.renderer.createText(this._el_35, '\n        1x1\n        ', null);
        this._el_39 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_35, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](6, '_ngcontent-uoe-1', '', 'class', 'gridster-item-inner', 'style', 'width: 0;height: 0;'), null);
        this._text_40 = this.renderer.createText(this._el_39, '\n            ', null);
        this._el_41 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_39, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, '_ngcontent-uoe-2', '', 'class', 'panel-heading'), null);
        this._text_42 = this.renderer.createText(this._el_41, '\n                ', null);
        this._el_43 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_41, 'h5', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, '_ngcontent-uoe-2', '', 'class', 'panel-title'), null);
        this._text_44 = this.renderer.createText(this._el_43, 'New widget', null);
        this._text_45 = this.renderer.createText(this._el_41, '\n            ', null);
        this._text_46 = this.renderer.createText(this._el_39, '\n        ', null);
        this._text_47 = this.renderer.createText(this._el_35, '\n    ', null);
        this._text_48 = this.renderer.createText(this._el_33, '\n\n    ', null);
        this._el_49 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_33, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, 'class', 'gridster-item-prototype', 'gridsterItemPrototype', ''), null);
        this._GridsterItemPrototypeDirective_49_3 = new __WEBPACK_IMPORTED_MODULE_19__gridster_gridster_prototype_gridster_item_prototype_directive_ngfactory__["a" /* Wrapper_GridsterItemPrototypeDirective */](new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_49), this.parentView.injectorGet(__WEBPACK_IMPORTED_MODULE_25__app_gridster_gridster_prototype_gridster_prototype_service__["a" /* GridsterPrototypeService */], this.parentIndex));
        this._text_50 = this.renderer.createText(this._el_49, '\n        Drag me (clone)', null);
        this._el_51 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_49, 'br', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_52 = this.renderer.createText(this._el_49, '\n        1x2\n        ', null);
        this._el_53 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_49, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](6, '_ngcontent-uoe-1', '', 'class', 'gridster-item-inner', 'style', 'width: 0;height: 0;'), null);
        this._text_54 = this.renderer.createText(this._el_53, '\n            ', null);
        this._el_55 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_53, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, '_ngcontent-uoe-2', '', 'class', 'panel-heading'), null);
        this._text_56 = this.renderer.createText(this._el_55, '\n                ', null);
        this._el_57 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_55, 'h5', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, '_ngcontent-uoe-2', '', 'class', 'panel-title'), null);
        this._text_58 = this.renderer.createText(this._el_57, 'New widget', null);
        this._text_59 = this.renderer.createText(this._el_55, '\n            ', null);
        this._text_60 = this.renderer.createText(this._el_53, '\n        ', null);
        this._text_61 = this.renderer.createText(this._el_49, '\n    ', null);
        this._text_62 = this.renderer.createText(this._el_33, '\n\n    ', null);
        this._el_63 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_33, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, 'class', 'gridster-item-prototype', 'gridsterItemPrototype', ''), null);
        this._GridsterItemPrototypeDirective_63_3 = new __WEBPACK_IMPORTED_MODULE_19__gridster_gridster_prototype_gridster_item_prototype_directive_ngfactory__["a" /* Wrapper_GridsterItemPrototypeDirective */](new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_63), this.parentView.injectorGet(__WEBPACK_IMPORTED_MODULE_25__app_gridster_gridster_prototype_gridster_prototype_service__["a" /* GridsterPrototypeService */], this.parentIndex));
        this._text_64 = this.renderer.createText(this._el_63, '\n        Drag me ', null);
        this._el_65 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_63, 'br', __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], null);
        this._text_66 = this.renderer.createText(this._el_63, '\n        2x1\n        ', null);
        this._el_67 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_63, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](6, '_ngcontent-uoe-1', '', 'class', 'gridster-item-inner', 'style', 'width: 0;height: 0;'), null);
        this._text_68 = this.renderer.createText(this._el_67, '\n            ', null);
        this._el_69 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_67, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, '_ngcontent-uoe-2', '', 'class', 'panel-heading'), null);
        this._text_70 = this.renderer.createText(this._el_69, '\n                ', null);
        this._el_71 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_69, 'h5', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, '_ngcontent-uoe-2', '', 'class', 'panel-title'), null);
        this._text_72 = this.renderer.createText(this._el_71, 'New widget', null);
        this._text_73 = this.renderer.createText(this._el_69, '\n            ', null);
        this._text_74 = this.renderer.createText(this._el_67, '\n        ', null);
        this._text_75 = this.renderer.createText(this._el_63, '\n    ', null);
        this._text_76 = this.renderer.createText(this._el_33, '\n', null);
        this._text_77 = this.renderer.createText(parentRenderNode, '\n', null);
        this._el_78 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, parentRenderNode, 'div', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'main-content'), null);
        this._text_79 = this.renderer.createText(this._el_78, '\n\n    ', null);
        this._el_80 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_78, 'gridster', new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'style', 'min-height: 500px;'), null);
        this.compView_80 = new __WEBPACK_IMPORTED_MODULE_22__gridster_gridster_component_ngfactory__["a" /* View_GridsterComponent0 */](this.viewUtils, this, 80, this._el_80);
        this._GridsterService_80_3 = new __WEBPACK_IMPORTED_MODULE_21__app_gridster_gridster_service__["a" /* GridsterService */]();
        this._GridsterComponent_80_4 = new __WEBPACK_IMPORTED_MODULE_22__gridster_gridster_component_ngfactory__["b" /* Wrapper_GridsterComponent */](new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_80), this._GridsterService_80_3, this.compView_80.ref, this.parentView.injectorGet(__WEBPACK_IMPORTED_MODULE_25__app_gridster_gridster_prototype_gridster_prototype_service__["a" /* GridsterPrototypeService */], this.parentIndex));
        this._text_81 = this.renderer.createText(null, '\n\n        ', null);
        this._anchor_82 = this.renderer.createTemplateAnchor(null, null);
        this._vc_82 = new __WEBPACK_IMPORTED_MODULE_10__angular_core_src_linker_view_container__["a" /* ViewContainer */](82, 80, this, this._anchor_82);
        this._TemplateRef_82_5 = new __WEBPACK_IMPORTED_MODULE_26__angular_core_src_linker_template_ref__["a" /* TemplateRef_ */](this, 82, this._anchor_82);
        this._NgFor_82_6 = new __WEBPACK_IMPORTED_MODULE_23__gendir_node_modules_angular_common_src_directives_ng_for_ngfactory__["a" /* Wrapper_NgFor */](this._vc_82.vcRef, this._TemplateRef_82_5, this.parentView.injectorGet(__WEBPACK_IMPORTED_MODULE_27__angular_core_src_change_detection_differs_iterable_differs__["a" /* IterableDiffers */], this.parentIndex), this.ref);
        this._text_83 = this.renderer.createText(null, '\n\n    ', null);
        this.compView_80.create(this._GridsterComponent_80_4.context);
        this._text_84 = this.renderer.createText(this._el_78, '\n', null);
        var disposable_0 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_5, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'click', null), this.eventHandler(this.handleEvent_5));
        var disposable_1 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_8, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'click', null), this.eventHandler(this.handleEvent_8));
        var disposable_2 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_11, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray2"](2, 'click', null), this.eventHandler(this.handleEvent_11));
        var disposable_3 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_14, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](6, 'ngModelChange', null, 'change', null, 'blur', null), this.eventHandler(this.handleEvent_14));
        this._NgModel_14_5.subscribe(this, this.eventHandler(this.handleEvent_14), true);
        var disposable_4 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_16, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](6, 'ngModelChange', null, 'change', null, 'blur', null), this.eventHandler(this.handleEvent_16));
        this._NgModel_16_5.subscribe(this, this.eventHandler(this.handleEvent_16), true);
        var disposable_5 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_22, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](8, 'ngModelChange', null, 'change', null, 'input', null, 'blur', null), this.eventHandler(this.handleEvent_22));
        this._NgModel_22_6.subscribe(this, this.eventHandler(this.handleEvent_22), true);
        var disposable_6 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_27, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](8, 'ngModelChange', null, 'change', null, 'input', null, 'blur', null), this.eventHandler(this.handleEvent_27));
        this._NgModel_27_6.subscribe(this, this.eventHandler(this.handleEvent_27), true);
        var disposable_7 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_35, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](6, 'drop', null, 'enter', null, 'out', null), this.eventHandler(this.handleEvent_35));
        this._GridsterItemPrototypeDirective_35_3.subscribe(this, this.eventHandler(this.handleEvent_35), true, false, false, true, true);
        var disposable_8 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_49, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](6, 'drop', null, 'enter', null, 'out', null), this.eventHandler(this.handleEvent_49));
        this._GridsterItemPrototypeDirective_49_3.subscribe(this, this.eventHandler(this.handleEvent_49), true, false, false, true, true);
        var disposable_9 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_63, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray8"](6, 'drop', null, 'enter', null, 'out', null), this.eventHandler(this.handleEvent_63));
        this._GridsterItemPrototypeDirective_63_3.subscribe(this, this.eventHandler(this.handleEvent_63), true, false, false, true, true);
        var disposable_10 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["subscribeToRenderElement"](this, this._el_80, new __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["InlineArray4"](4, 'gridsterPositionChange', null, 'resize', null), this.eventHandler(this.handleEvent_80));
        this._GridsterComponent_80_4.subscribe(this, this.eventHandler(this.handleEvent_80), true, true);
        this._viewQuery_GridsterComponent_0.reset([this._GridsterComponent_80_4.context]);
        this.context.gridster = this._viewQuery_GridsterComponent_0.first;
        this.init(null, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._text_2,
            this._el_3,
            this._text_4,
            this._el_5,
            this._text_6,
            this._text_7,
            this._el_8,
            this._text_9,
            this._text_10,
            this._el_11,
            this._text_12,
            this._text_13,
            this._el_14,
            this._text_15,
            this._el_16,
            this._text_17,
            this._el_18,
            this._text_19,
            this._el_20,
            this._text_21,
            this._el_22,
            this._text_23,
            this._text_24,
            this._el_25,
            this._text_26,
            this._el_27,
            this._text_28,
            this._text_29,
            this._el_30,
            this._text_31,
            this._text_32,
            this._el_33,
            this._text_34,
            this._el_35,
            this._text_36,
            this._el_37,
            this._text_38,
            this._el_39,
            this._text_40,
            this._el_41,
            this._text_42,
            this._el_43,
            this._text_44,
            this._text_45,
            this._text_46,
            this._text_47,
            this._text_48,
            this._el_49,
            this._text_50,
            this._el_51,
            this._text_52,
            this._el_53,
            this._text_54,
            this._el_55,
            this._text_56,
            this._el_57,
            this._text_58,
            this._text_59,
            this._text_60,
            this._text_61,
            this._text_62,
            this._el_63,
            this._text_64,
            this._el_65,
            this._text_66,
            this._el_67,
            this._text_68,
            this._el_69,
            this._text_70,
            this._el_71,
            this._text_72,
            this._text_73,
            this._text_74,
            this._text_75,
            this._text_76,
            this._text_77,
            this._el_78,
            this._text_79,
            this._el_80,
            this._text_81,
            this._anchor_82,
            this._text_83,
            this._text_84
        ]), [
            disposable_0,
            disposable_1,
            disposable_2,
            disposable_3,
            disposable_4,
            disposable_5,
            disposable_6,
            disposable_7,
            disposable_8,
            disposable_9,
            disposable_10
        ]);
        return null;
    };
    View_AppComponent0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === __WEBPACK_IMPORTED_MODULE_28__angular_forms_src_directives_checkbox_value_accessor__["a" /* CheckboxControlValueAccessor */]) && (14 === requestNodeIndex))) {
            return this._CheckboxControlValueAccessor_14_3.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_29__angular_forms_src_directives_control_value_accessor__["a" /* NG_VALUE_ACCESSOR */]) && (14 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_14_4;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_30__angular_forms_src_directives_ng_model__["a" /* NgModel */]) && (14 === requestNodeIndex))) {
            return this._NgModel_14_5.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_31__angular_forms_src_directives_ng_control__["a" /* NgControl */]) && (14 === requestNodeIndex))) {
            return this._NgControl_14_6;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_32__angular_forms_src_directives_ng_control_status__["a" /* NgControlStatus */]) && (14 === requestNodeIndex))) {
            return this._NgControlStatus_14_7.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_28__angular_forms_src_directives_checkbox_value_accessor__["a" /* CheckboxControlValueAccessor */]) && (16 === requestNodeIndex))) {
            return this._CheckboxControlValueAccessor_16_3.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_29__angular_forms_src_directives_control_value_accessor__["a" /* NG_VALUE_ACCESSOR */]) && (16 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_16_4;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_30__angular_forms_src_directives_ng_model__["a" /* NgModel */]) && (16 === requestNodeIndex))) {
            return this._NgModel_16_5.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_31__angular_forms_src_directives_ng_control__["a" /* NgControl */]) && (16 === requestNodeIndex))) {
            return this._NgControl_16_6;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_32__angular_forms_src_directives_ng_control_status__["a" /* NgControlStatus */]) && (16 === requestNodeIndex))) {
            return this._NgControlStatus_16_7.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_33__angular_forms_src_directives_default_value_accessor__["a" /* DefaultValueAccessor */]) && (22 === requestNodeIndex))) {
            return this._DefaultValueAccessor_22_3.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_24__angular_forms_src_directives_radio_control_value_accessor__["b" /* RadioControlValueAccessor */]) && (22 === requestNodeIndex))) {
            return this._RadioControlValueAccessor_22_4.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_29__angular_forms_src_directives_control_value_accessor__["a" /* NG_VALUE_ACCESSOR */]) && (22 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_22_5;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_30__angular_forms_src_directives_ng_model__["a" /* NgModel */]) && (22 === requestNodeIndex))) {
            return this._NgModel_22_6.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_31__angular_forms_src_directives_ng_control__["a" /* NgControl */]) && (22 === requestNodeIndex))) {
            return this._NgControl_22_7;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_32__angular_forms_src_directives_ng_control_status__["a" /* NgControlStatus */]) && (22 === requestNodeIndex))) {
            return this._NgControlStatus_22_8.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_33__angular_forms_src_directives_default_value_accessor__["a" /* DefaultValueAccessor */]) && (27 === requestNodeIndex))) {
            return this._DefaultValueAccessor_27_3.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_24__angular_forms_src_directives_radio_control_value_accessor__["b" /* RadioControlValueAccessor */]) && (27 === requestNodeIndex))) {
            return this._RadioControlValueAccessor_27_4.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_29__angular_forms_src_directives_control_value_accessor__["a" /* NG_VALUE_ACCESSOR */]) && (27 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_27_5;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_30__angular_forms_src_directives_ng_model__["a" /* NgModel */]) && (27 === requestNodeIndex))) {
            return this._NgModel_27_6.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_31__angular_forms_src_directives_ng_control__["a" /* NgControl */]) && (27 === requestNodeIndex))) {
            return this._NgControl_27_7;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_32__angular_forms_src_directives_ng_control_status__["a" /* NgControlStatus */]) && (27 === requestNodeIndex))) {
            return this._NgControlStatus_27_8.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_34__app_gridster_gridster_prototype_gridster_item_prototype_directive__["a" /* GridsterItemPrototypeDirective */]) && ((35 <= requestNodeIndex) && (requestNodeIndex <= 47)))) {
            return this._GridsterItemPrototypeDirective_35_3.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_34__app_gridster_gridster_prototype_gridster_item_prototype_directive__["a" /* GridsterItemPrototypeDirective */]) && ((49 <= requestNodeIndex) && (requestNodeIndex <= 61)))) {
            return this._GridsterItemPrototypeDirective_49_3.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_34__app_gridster_gridster_prototype_gridster_item_prototype_directive__["a" /* GridsterItemPrototypeDirective */]) && ((63 <= requestNodeIndex) && (requestNodeIndex <= 75)))) {
            return this._GridsterItemPrototypeDirective_63_3.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_26__angular_core_src_linker_template_ref__["b" /* TemplateRef */]) && (82 === requestNodeIndex))) {
            return this._TemplateRef_82_5;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_35__angular_common_src_directives_ng_for__["a" /* NgFor */]) && (82 === requestNodeIndex))) {
            return this._NgFor_82_6.context;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_21__app_gridster_gridster_service__["a" /* GridsterService */]) && ((80 <= requestNodeIndex) && (requestNodeIndex <= 83)))) {
            return this._GridsterService_80_3;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_20__app_gridster_gridster_component__["a" /* GridsterComponent */]) && ((80 <= requestNodeIndex) && (requestNodeIndex <= 83)))) {
            return this._GridsterComponent_80_4.context;
        }
        return notFoundResult;
    };
    View_AppComponent0.prototype.detectChangesInternal = function (throwOnChange) {
        this._CheckboxControlValueAccessor_14_3.ngDoCheck(this, this._el_14, throwOnChange);
        var currVal_14_1_0 = this.context.gridsterOptions.dragAndDrop;
        this._NgModel_14_5.check_model(currVal_14_1_0, throwOnChange, false);
        this._NgModel_14_5.ngDoCheck(this, this._el_14, throwOnChange);
        this._NgControlStatus_14_7.ngDoCheck(this, this._el_14, throwOnChange);
        this._CheckboxControlValueAccessor_16_3.ngDoCheck(this, this._el_16, throwOnChange);
        var currVal_16_1_0 = this.context.gridsterOptions.resizable;
        this._NgModel_16_5.check_model(currVal_16_1_0, throwOnChange, false);
        this._NgModel_16_5.ngDoCheck(this, this._el_16, throwOnChange);
        this._NgControlStatus_16_7.ngDoCheck(this, this._el_16, throwOnChange);
        this._DefaultValueAccessor_22_3.ngDoCheck(this, this._el_22, throwOnChange);
        var currVal_22_1_0 = 'horizontal';
        this._RadioControlValueAccessor_22_4.check_value(currVal_22_1_0, throwOnChange, false);
        this._RadioControlValueAccessor_22_4.ngDoCheck(this, this._el_22, throwOnChange);
        var currVal_22_2_0 = this.context.gridsterOptions.direction;
        this._NgModel_22_6.check_model(currVal_22_2_0, throwOnChange, false);
        this._NgModel_22_6.ngDoCheck(this, this._el_22, throwOnChange);
        this._NgControlStatus_22_8.ngDoCheck(this, this._el_22, throwOnChange);
        this._DefaultValueAccessor_27_3.ngDoCheck(this, this._el_27, throwOnChange);
        var currVal_27_1_0 = 'vertical';
        this._RadioControlValueAccessor_27_4.check_value(currVal_27_1_0, throwOnChange, false);
        this._RadioControlValueAccessor_27_4.ngDoCheck(this, this._el_27, throwOnChange);
        var currVal_27_2_0 = this.context.gridsterOptions.direction;
        this._NgModel_27_6.check_model(currVal_27_2_0, throwOnChange, false);
        this._NgModel_27_6.ngDoCheck(this, this._el_27, throwOnChange);
        this._NgControlStatus_27_8.ngDoCheck(this, this._el_27, throwOnChange);
        var currVal_35_0_0 = this._map_120(true);
        this._GridsterItemPrototypeDirective_35_3.check_config(currVal_35_0_0, throwOnChange, false);
        var currVal_35_0_1 = 1;
        this._GridsterItemPrototypeDirective_35_3.check_w(currVal_35_0_1, throwOnChange, false);
        var currVal_35_0_2 = 1;
        this._GridsterItemPrototypeDirective_35_3.check_h(currVal_35_0_2, throwOnChange, false);
        this._GridsterItemPrototypeDirective_35_3.ngDoCheck(this, this._el_35, throwOnChange);
        var currVal_49_0_0 = this._map_121(true);
        this._GridsterItemPrototypeDirective_49_3.check_config(currVal_49_0_0, throwOnChange, false);
        var currVal_49_0_1 = 1;
        this._GridsterItemPrototypeDirective_49_3.check_w(currVal_49_0_1, throwOnChange, false);
        var currVal_49_0_2 = 2;
        this._GridsterItemPrototypeDirective_49_3.check_h(currVal_49_0_2, throwOnChange, false);
        this._GridsterItemPrototypeDirective_49_3.ngDoCheck(this, this._el_49, throwOnChange);
        var currVal_63_0_0 = this._map_122(false);
        this._GridsterItemPrototypeDirective_63_3.check_config(currVal_63_0_0, throwOnChange, false);
        var currVal_63_0_1 = 2;
        this._GridsterItemPrototypeDirective_63_3.check_w(currVal_63_0_1, throwOnChange, false);
        var currVal_63_0_2 = 1;
        this._GridsterItemPrototypeDirective_63_3.check_h(currVal_63_0_2, throwOnChange, false);
        this._GridsterItemPrototypeDirective_63_3.ngDoCheck(this, this._el_63, throwOnChange);
        var currVal_80_0_0 = this.context.gridsterOptions;
        this._GridsterComponent_80_4.check_options(currVal_80_0_0, throwOnChange, false);
        var currVal_80_0_1 = this.context.gridsterDraggableOptions;
        this._GridsterComponent_80_4.check_draggableOptions(currVal_80_0_1, throwOnChange, false);
        this._GridsterComponent_80_4.ngDoCheck(this, this._el_80, throwOnChange);
        var currVal_82_0_0 = this.context.widgets;
        this._NgFor_82_6.check_ngForOf(currVal_82_0_0, throwOnChange, false);
        this._NgFor_82_6.ngDoCheck(this, this._anchor_82, throwOnChange);
        this._vc_82.detectChangesInNestedViews(throwOnChange);
        var currVal_117 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["inlineInterpolate"](1, '\n    ', this.context.title, '\n');
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_117, currVal_117)) {
            this.renderer.setText(this._text_1, currVal_117);
            this._expr_117 = currVal_117;
        }
        var currVal_118 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["inlineInterpolate"](1, '\n    ', this.context.gridsterOptions.lanes, '\n    ');
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_118, currVal_118)) {
            this.renderer.setText(this._text_7, currVal_118);
            this._expr_118 = currVal_118;
        }
        this._NgControlStatus_14_7.checkHost(this, this, this._el_14, throwOnChange);
        this._NgControlStatus_16_7.checkHost(this, this, this._el_16, throwOnChange);
        this._NgControlStatus_22_8.checkHost(this, this, this._el_22, throwOnChange);
        this._NgControlStatus_27_8.checkHost(this, this, this._el_27, throwOnChange);
        var currVal_119 = __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["inlineInterpolate"](2, '\n    HorizontalMax size: ', this.context.gridsterOptions.maxWidth, ' x ', this.context.gridsterOptions.maxHeight, '\n');
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_119, currVal_119)) {
            this.renderer.setText(this._text_31, currVal_119);
            this._expr_119 = currVal_119;
        }
        this._GridsterComponent_80_4.checkHost(this, this.compView_80, this._el_80, throwOnChange);
        this.compView_80.internalDetectChanges(throwOnChange);
        if (!throwOnChange) {
            if ((this.numberOfChecks === 0)) {
                this._GridsterComponent_80_4.context.ngAfterViewInit();
            }
        }
    };
    View_AppComponent0.prototype.destroyInternal = function () {
        this._vc_82.destroyNestedViews();
        this.compView_80.destroy();
        this._NgModel_14_5.ngOnDestroy();
        this._NgModel_16_5.ngOnDestroy();
        this._RadioControlValueAccessor_22_4.ngOnDestroy();
        this._NgModel_22_6.ngOnDestroy();
        this._RadioControlValueAccessor_27_4.ngOnDestroy();
        this._NgModel_27_6.ngOnDestroy();
        this._GridsterItemPrototypeDirective_35_3.ngOnDestroy();
        this._GridsterItemPrototypeDirective_49_3.ngOnDestroy();
        this._GridsterItemPrototypeDirective_63_3.ngOnDestroy();
        this._GridsterComponent_80_4.ngOnDestroy();
    };
    View_AppComponent0.prototype.visitProjectableNodesInternal = function (nodeIndex, ngContentIndex, cb, ctx) {
        if (((nodeIndex == 80) && (ngContentIndex == 0))) {
            cb(this._text_81, ctx);
            cb(this._vc_82.nativeElement, ctx);
            this._vc_82.visitNestedViewRootNodes(cb, ctx);
            cb(this._text_83, ctx);
        }
    };
    View_AppComponent0.prototype.createEmbeddedViewInternal = function (nodeIndex) {
        if ((nodeIndex == 82)) {
            return new View_AppComponent1(this.viewUtils, this, 82, this._anchor_82, this._vc_82);
        }
        return null;
    };
    View_AppComponent0.prototype.handleEvent_5 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.context.removeLine(this._GridsterComponent_80_4.context) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_8 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.context.addLine(this._GridsterComponent_80_4.context) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_11 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.context.addWidgetWithoutData() !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_14 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._CheckboxControlValueAccessor_14_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.context.gridsterOptions.dragAndDrop = $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'change')) {
            var pd_sub_1 = (this._GridsterComponent_80_4.context.setOption('dragAndDrop', this.context.gridsterOptions.dragAndDrop) !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_16 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._CheckboxControlValueAccessor_16_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.context.gridsterOptions.resizable = $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'change')) {
            var pd_sub_1 = (this._GridsterComponent_80_4.context.setOption('resizable', this.context.gridsterOptions.resizable) !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_22 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_22_3.handleEvent(eventName, $event) && result);
        result = (this._RadioControlValueAccessor_22_4.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.context.gridsterOptions.direction = $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'change')) {
            var pd_sub_1 = (this._GridsterComponent_80_4.context.setOption('direction', 'horizontal').reload() !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_27 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_27_3.handleEvent(eventName, $event) && result);
        result = (this._RadioControlValueAccessor_27_4.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.context.gridsterOptions.direction = $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'change')) {
            var pd_sub_1 = (this._GridsterComponent_80_4.context.setOption('direction', 'vertical').reload() !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_35 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'drop')) {
            var pd_sub_0 = (this.context.addWidgetFromDrag(this._GridsterComponent_80_4.context, $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'enter')) {
            var pd_sub_1 = (this.context.over($event) !== false);
            result = (pd_sub_1 && result);
        }
        if ((eventName == 'out')) {
            var pd_sub_2 = (this.context.out($event) !== false);
            result = (pd_sub_2 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_49 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'drop')) {
            var pd_sub_0 = (this.context.addWidgetFromDrag(this._GridsterComponent_80_4.context, $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'enter')) {
            var pd_sub_1 = (this.context.over($event) !== false);
            result = (pd_sub_1 && result);
        }
        if ((eventName == 'out')) {
            var pd_sub_2 = (this.context.out($event) !== false);
            result = (pd_sub_2 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_63 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'drop')) {
            var pd_sub_0 = (this.context.addWidgetFromDrag(this._GridsterComponent_80_4.context, $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'enter')) {
            var pd_sub_1 = (this.context.over($event) !== false);
            result = (pd_sub_1 && result);
        }
        if ((eventName == 'out')) {
            var pd_sub_2 = (this.context.out($event) !== false);
            result = (pd_sub_2 && result);
        }
        return result;
    };
    View_AppComponent0.prototype.handleEvent_80 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'gridsterPositionChange')) {
            var pd_sub_0 = (this.context.logChanges($event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'resize')) {
            var pd_sub_1 = (this.context.resize($event) !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    return View_AppComponent0;
}(__WEBPACK_IMPORTED_MODULE_1__angular_core_src_linker_view__["a" /* AppView */]));
//# sourceMappingURL=app.component.ngfactory.js.map

/***/ }),

/***/ 349:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core_src_linker_ng_module_factory__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_app_module__ = __webpack_require__(360);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_src_common_module__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core_src_application_module__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_src_browser__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms_src_directives__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms_src_form_providers__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_http_src_http_module__ = __webpack_require__(332);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_gridster_gridster_module__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_common_src_localization__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_core_src_application_init__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_core_src_testability_testability__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__angular_core_src_application_ref__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_core_src_linker_compiler__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__angular_platform_browser_src_dom_events_hammer_gestures__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__angular_platform_browser_src_dom_events_event_manager__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__angular_platform_browser_src_dom_shared_styles_host__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__angular_platform_browser_src_dom_dom_renderer__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__angular_platform_browser_src_security_dom_sanitization_service__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__angular_core_src_animation_animation_queue__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__angular_core_src_linker_view_utils__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__angular_platform_browser_src_browser_title__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__angular_forms_src_directives_radio_control_value_accessor__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__angular_http_src_backends_browser_xhr__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__angular_http_src_base_response_options__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__angular_http_src_backends_xhr_backend__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__angular_http_src_base_request_options__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__app_gridster_gridster_prototype_gridster_prototype_service__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__app_component_ngfactory__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__angular_core_src_i18n_tokens__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__angular_core_src_application_tokens__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__angular_platform_browser_src_dom_events_dom_events__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__angular_platform_browser_src_dom_events_key_events__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__angular_core_src_zone_ng_zone__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__angular_platform_browser_src_dom_debug_ng_probe__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__angular_core_src_console__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__angular_core_src_error_handler__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__angular_platform_browser_src_dom_dom_tokens__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__angular_platform_browser_src_dom_animation_driver__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__angular_core_src_render_api__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__angular_core_src_security__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__angular_core_src_change_detection_differs_iterable_differs__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__angular_core_src_change_detection_differs_keyvalue_differs__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__angular_http_src_interfaces__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__angular_http_src_http__ = __webpack_require__(224);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModuleNgFactory; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};













































var AppModuleInjector = (function (_super) {
    __extends(AppModuleInjector, _super);
    function AppModuleInjector(parent) {
        _super.call(this, parent, [__WEBPACK_IMPORTED_MODULE_28__app_component_ngfactory__["a" /* AppComponentNgFactory */]], [__WEBPACK_IMPORTED_MODULE_28__app_component_ngfactory__["a" /* AppComponentNgFactory */]]);
    }
    Object.defineProperty(AppModuleInjector.prototype, "_LOCALE_ID_8", {
        get: function () {
            if ((this.__LOCALE_ID_8 == null)) {
                (this.__LOCALE_ID_8 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_application_module__["a" /* _localeFactory */](this.parent.get(__WEBPACK_IMPORTED_MODULE_29__angular_core_src_i18n_tokens__["a" /* LOCALE_ID */], null)));
            }
            return this.__LOCALE_ID_8;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_NgLocalization_9", {
        get: function () {
            if ((this.__NgLocalization_9 == null)) {
                (this.__NgLocalization_9 = new __WEBPACK_IMPORTED_MODULE_9__angular_common_src_localization__["a" /* NgLocaleLocalization */](this._LOCALE_ID_8));
            }
            return this.__NgLocalization_9;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ApplicationRef_14", {
        get: function () {
            if ((this.__ApplicationRef_14 == null)) {
                (this.__ApplicationRef_14 = this._ApplicationRef__13);
            }
            return this.__ApplicationRef_14;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Compiler_15", {
        get: function () {
            if ((this.__Compiler_15 == null)) {
                (this.__Compiler_15 = new __WEBPACK_IMPORTED_MODULE_13__angular_core_src_linker_compiler__["a" /* Compiler */]());
            }
            return this.__Compiler_15;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_APP_ID_16", {
        get: function () {
            if ((this.__APP_ID_16 == null)) {
                (this.__APP_ID_16 = __WEBPACK_IMPORTED_MODULE_30__angular_core_src_application_tokens__["a" /* _appIdRandomProviderFactory */]());
            }
            return this.__APP_ID_16;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DOCUMENT_17", {
        get: function () {
            if ((this.__DOCUMENT_17 == null)) {
                (this.__DOCUMENT_17 = __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_src_browser__["a" /* _document */]());
            }
            return this.__DOCUMENT_17;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_HAMMER_GESTURE_CONFIG_18", {
        get: function () {
            if ((this.__HAMMER_GESTURE_CONFIG_18 == null)) {
                (this.__HAMMER_GESTURE_CONFIG_18 = new __WEBPACK_IMPORTED_MODULE_14__angular_platform_browser_src_dom_events_hammer_gestures__["a" /* HammerGestureConfig */]());
            }
            return this.__HAMMER_GESTURE_CONFIG_18;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_EVENT_MANAGER_PLUGINS_19", {
        get: function () {
            if ((this.__EVENT_MANAGER_PLUGINS_19 == null)) {
                (this.__EVENT_MANAGER_PLUGINS_19 = [
                    new __WEBPACK_IMPORTED_MODULE_31__angular_platform_browser_src_dom_events_dom_events__["a" /* DomEventsPlugin */](),
                    new __WEBPACK_IMPORTED_MODULE_32__angular_platform_browser_src_dom_events_key_events__["a" /* KeyEventsPlugin */](),
                    new __WEBPACK_IMPORTED_MODULE_14__angular_platform_browser_src_dom_events_hammer_gestures__["b" /* HammerGesturesPlugin */](this._HAMMER_GESTURE_CONFIG_18)
                ]);
            }
            return this.__EVENT_MANAGER_PLUGINS_19;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_EventManager_20", {
        get: function () {
            if ((this.__EventManager_20 == null)) {
                (this.__EventManager_20 = new __WEBPACK_IMPORTED_MODULE_15__angular_platform_browser_src_dom_events_event_manager__["a" /* EventManager */](this._EVENT_MANAGER_PLUGINS_19, this.parent.get(__WEBPACK_IMPORTED_MODULE_33__angular_core_src_zone_ng_zone__["a" /* NgZone */])));
            }
            return this.__EventManager_20;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_AnimationDriver_22", {
        get: function () {
            if ((this.__AnimationDriver_22 == null)) {
                (this.__AnimationDriver_22 = __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_src_browser__["b" /* _resolveDefaultAnimationDriver */]());
            }
            return this.__AnimationDriver_22;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DomRootRenderer_23", {
        get: function () {
            if ((this.__DomRootRenderer_23 == null)) {
                (this.__DomRootRenderer_23 = new __WEBPACK_IMPORTED_MODULE_17__angular_platform_browser_src_dom_dom_renderer__["a" /* DomRootRenderer_ */](this._DOCUMENT_17, this._EventManager_20, this._DomSharedStylesHost_21, this._AnimationDriver_22, this._APP_ID_16));
            }
            return this.__DomRootRenderer_23;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RootRenderer_24", {
        get: function () {
            if ((this.__RootRenderer_24 == null)) {
                (this.__RootRenderer_24 = __WEBPACK_IMPORTED_MODULE_34__angular_platform_browser_src_dom_debug_ng_probe__["a" /* _createConditionalRootRenderer */](this._DomRootRenderer_23, this.parent.get(__WEBPACK_IMPORTED_MODULE_34__angular_platform_browser_src_dom_debug_ng_probe__["b" /* NgProbeToken */], null), this.parent.get(__WEBPACK_IMPORTED_MODULE_12__angular_core_src_application_ref__["a" /* NgProbeToken */], null)));
            }
            return this.__RootRenderer_24;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DomSanitizer_25", {
        get: function () {
            if ((this.__DomSanitizer_25 == null)) {
                (this.__DomSanitizer_25 = new __WEBPACK_IMPORTED_MODULE_18__angular_platform_browser_src_security_dom_sanitization_service__["a" /* DomSanitizerImpl */]());
            }
            return this.__DomSanitizer_25;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Sanitizer_26", {
        get: function () {
            if ((this.__Sanitizer_26 == null)) {
                (this.__Sanitizer_26 = this._DomSanitizer_25);
            }
            return this.__Sanitizer_26;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_AnimationQueue_27", {
        get: function () {
            if ((this.__AnimationQueue_27 == null)) {
                (this.__AnimationQueue_27 = new __WEBPACK_IMPORTED_MODULE_19__angular_core_src_animation_animation_queue__["a" /* AnimationQueue */](this.parent.get(__WEBPACK_IMPORTED_MODULE_33__angular_core_src_zone_ng_zone__["a" /* NgZone */])));
            }
            return this.__AnimationQueue_27;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ViewUtils_28", {
        get: function () {
            if ((this.__ViewUtils_28 == null)) {
                (this.__ViewUtils_28 = new __WEBPACK_IMPORTED_MODULE_20__angular_core_src_linker_view_utils__["ViewUtils"](this._RootRenderer_24, this._Sanitizer_26, this._AnimationQueue_27));
            }
            return this.__ViewUtils_28;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_IterableDiffers_29", {
        get: function () {
            if ((this.__IterableDiffers_29 == null)) {
                (this.__IterableDiffers_29 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_application_module__["b" /* _iterableDiffersFactory */]());
            }
            return this.__IterableDiffers_29;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_KeyValueDiffers_30", {
        get: function () {
            if ((this.__KeyValueDiffers_30 == null)) {
                (this.__KeyValueDiffers_30 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_application_module__["c" /* _keyValueDiffersFactory */]());
            }
            return this.__KeyValueDiffers_30;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_SharedStylesHost_31", {
        get: function () {
            if ((this.__SharedStylesHost_31 == null)) {
                (this.__SharedStylesHost_31 = this._DomSharedStylesHost_21);
            }
            return this.__SharedStylesHost_31;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Title_32", {
        get: function () {
            if ((this.__Title_32 == null)) {
                (this.__Title_32 = new __WEBPACK_IMPORTED_MODULE_21__angular_platform_browser_src_browser_title__["a" /* Title */]());
            }
            return this.__Title_32;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RadioControlRegistry_33", {
        get: function () {
            if ((this.__RadioControlRegistry_33 == null)) {
                (this.__RadioControlRegistry_33 = new __WEBPACK_IMPORTED_MODULE_22__angular_forms_src_directives_radio_control_value_accessor__["a" /* RadioControlRegistry */]());
            }
            return this.__RadioControlRegistry_33;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_BrowserXhr_34", {
        get: function () {
            if ((this.__BrowserXhr_34 == null)) {
                (this.__BrowserXhr_34 = new __WEBPACK_IMPORTED_MODULE_23__angular_http_src_backends_browser_xhr__["a" /* BrowserXhr */]());
            }
            return this.__BrowserXhr_34;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ResponseOptions_35", {
        get: function () {
            if ((this.__ResponseOptions_35 == null)) {
                (this.__ResponseOptions_35 = new __WEBPACK_IMPORTED_MODULE_24__angular_http_src_base_response_options__["a" /* BaseResponseOptions */]());
            }
            return this.__ResponseOptions_35;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_XSRFStrategy_36", {
        get: function () {
            if ((this.__XSRFStrategy_36 == null)) {
                (this.__XSRFStrategy_36 = __WEBPACK_IMPORTED_MODULE_7__angular_http_src_http_module__["a" /* _createDefaultCookieXSRFStrategy */]());
            }
            return this.__XSRFStrategy_36;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_XHRBackend_37", {
        get: function () {
            if ((this.__XHRBackend_37 == null)) {
                (this.__XHRBackend_37 = new __WEBPACK_IMPORTED_MODULE_25__angular_http_src_backends_xhr_backend__["a" /* XHRBackend */](this._BrowserXhr_34, this._ResponseOptions_35, this._XSRFStrategy_36));
            }
            return this.__XHRBackend_37;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RequestOptions_38", {
        get: function () {
            if ((this.__RequestOptions_38 == null)) {
                (this.__RequestOptions_38 = new __WEBPACK_IMPORTED_MODULE_26__angular_http_src_base_request_options__["a" /* BaseRequestOptions */]());
            }
            return this.__RequestOptions_38;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Http_39", {
        get: function () {
            if ((this.__Http_39 == null)) {
                (this.__Http_39 = __WEBPACK_IMPORTED_MODULE_7__angular_http_src_http_module__["b" /* httpFactory */](this._XHRBackend_37, this._RequestOptions_38));
            }
            return this.__Http_39;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_GridsterPrototypeService_40", {
        get: function () {
            if ((this.__GridsterPrototypeService_40 == null)) {
                (this.__GridsterPrototypeService_40 = new __WEBPACK_IMPORTED_MODULE_27__app_gridster_gridster_prototype_gridster_prototype_service__["a" /* GridsterPrototypeService */]());
            }
            return this.__GridsterPrototypeService_40;
        },
        enumerable: true,
        configurable: true
    });
    AppModuleInjector.prototype.createInternal = function () {
        this._CommonModule_0 = new __WEBPACK_IMPORTED_MODULE_2__angular_common_src_common_module__["a" /* CommonModule */]();
        this._ApplicationModule_1 = new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_application_module__["d" /* ApplicationModule */]();
        this._BrowserModule_2 = new __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_src_browser__["c" /* BrowserModule */](this.parent.get(__WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_src_browser__["c" /* BrowserModule */], null));
        this._InternalFormsSharedModule_3 = new __WEBPACK_IMPORTED_MODULE_5__angular_forms_src_directives__["a" /* InternalFormsSharedModule */]();
        this._FormsModule_4 = new __WEBPACK_IMPORTED_MODULE_6__angular_forms_src_form_providers__["a" /* FormsModule */]();
        this._HttpModule_5 = new __WEBPACK_IMPORTED_MODULE_7__angular_http_src_http_module__["c" /* HttpModule */]();
        this._GridsterModule_6 = new __WEBPACK_IMPORTED_MODULE_8__app_gridster_gridster_module__["a" /* GridsterModule */]();
        this._AppModule_7 = new __WEBPACK_IMPORTED_MODULE_1__app_app_module__["a" /* AppModule */]();
        this._ErrorHandler_10 = __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_src_browser__["d" /* errorHandler */]();
        this._ApplicationInitStatus_11 = new __WEBPACK_IMPORTED_MODULE_10__angular_core_src_application_init__["a" /* ApplicationInitStatus */](this.parent.get(__WEBPACK_IMPORTED_MODULE_10__angular_core_src_application_init__["b" /* APP_INITIALIZER */], null));
        this._Testability_12 = new __WEBPACK_IMPORTED_MODULE_11__angular_core_src_testability_testability__["a" /* Testability */](this.parent.get(__WEBPACK_IMPORTED_MODULE_33__angular_core_src_zone_ng_zone__["a" /* NgZone */]));
        this._ApplicationRef__13 = new __WEBPACK_IMPORTED_MODULE_12__angular_core_src_application_ref__["b" /* ApplicationRef_ */](this.parent.get(__WEBPACK_IMPORTED_MODULE_33__angular_core_src_zone_ng_zone__["a" /* NgZone */]), this.parent.get(__WEBPACK_IMPORTED_MODULE_35__angular_core_src_console__["a" /* Console */]), this, this._ErrorHandler_10, this, this._ApplicationInitStatus_11, this.parent.get(__WEBPACK_IMPORTED_MODULE_11__angular_core_src_testability_testability__["b" /* TestabilityRegistry */], null), this._Testability_12);
        this._DomSharedStylesHost_21 = new __WEBPACK_IMPORTED_MODULE_16__angular_platform_browser_src_dom_shared_styles_host__["a" /* DomSharedStylesHost */](this._DOCUMENT_17);
        return this._AppModule_7;
    };
    AppModuleInjector.prototype.getInternal = function (token, notFoundResult) {
        if ((token === __WEBPACK_IMPORTED_MODULE_2__angular_common_src_common_module__["a" /* CommonModule */])) {
            return this._CommonModule_0;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_3__angular_core_src_application_module__["d" /* ApplicationModule */])) {
            return this._ApplicationModule_1;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_src_browser__["c" /* BrowserModule */])) {
            return this._BrowserModule_2;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_5__angular_forms_src_directives__["a" /* InternalFormsSharedModule */])) {
            return this._InternalFormsSharedModule_3;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_6__angular_forms_src_form_providers__["a" /* FormsModule */])) {
            return this._FormsModule_4;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_7__angular_http_src_http_module__["c" /* HttpModule */])) {
            return this._HttpModule_5;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_8__app_gridster_gridster_module__["a" /* GridsterModule */])) {
            return this._GridsterModule_6;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_1__app_app_module__["a" /* AppModule */])) {
            return this._AppModule_7;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_29__angular_core_src_i18n_tokens__["a" /* LOCALE_ID */])) {
            return this._LOCALE_ID_8;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_9__angular_common_src_localization__["b" /* NgLocalization */])) {
            return this._NgLocalization_9;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_36__angular_core_src_error_handler__["a" /* ErrorHandler */])) {
            return this._ErrorHandler_10;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_10__angular_core_src_application_init__["a" /* ApplicationInitStatus */])) {
            return this._ApplicationInitStatus_11;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_11__angular_core_src_testability_testability__["a" /* Testability */])) {
            return this._Testability_12;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_12__angular_core_src_application_ref__["b" /* ApplicationRef_ */])) {
            return this._ApplicationRef__13;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_12__angular_core_src_application_ref__["c" /* ApplicationRef */])) {
            return this._ApplicationRef_14;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_13__angular_core_src_linker_compiler__["a" /* Compiler */])) {
            return this._Compiler_15;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_30__angular_core_src_application_tokens__["b" /* APP_ID */])) {
            return this._APP_ID_16;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_37__angular_platform_browser_src_dom_dom_tokens__["a" /* DOCUMENT */])) {
            return this._DOCUMENT_17;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_14__angular_platform_browser_src_dom_events_hammer_gestures__["c" /* HAMMER_GESTURE_CONFIG */])) {
            return this._HAMMER_GESTURE_CONFIG_18;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_15__angular_platform_browser_src_dom_events_event_manager__["b" /* EVENT_MANAGER_PLUGINS */])) {
            return this._EVENT_MANAGER_PLUGINS_19;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_15__angular_platform_browser_src_dom_events_event_manager__["a" /* EventManager */])) {
            return this._EventManager_20;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_16__angular_platform_browser_src_dom_shared_styles_host__["a" /* DomSharedStylesHost */])) {
            return this._DomSharedStylesHost_21;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_38__angular_platform_browser_src_dom_animation_driver__["a" /* AnimationDriver */])) {
            return this._AnimationDriver_22;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_17__angular_platform_browser_src_dom_dom_renderer__["b" /* DomRootRenderer */])) {
            return this._DomRootRenderer_23;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_39__angular_core_src_render_api__["a" /* RootRenderer */])) {
            return this._RootRenderer_24;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_18__angular_platform_browser_src_security_dom_sanitization_service__["b" /* DomSanitizer */])) {
            return this._DomSanitizer_25;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_40__angular_core_src_security__["a" /* Sanitizer */])) {
            return this._Sanitizer_26;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_19__angular_core_src_animation_animation_queue__["a" /* AnimationQueue */])) {
            return this._AnimationQueue_27;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_20__angular_core_src_linker_view_utils__["ViewUtils"])) {
            return this._ViewUtils_28;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_41__angular_core_src_change_detection_differs_iterable_differs__["a" /* IterableDiffers */])) {
            return this._IterableDiffers_29;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_42__angular_core_src_change_detection_differs_keyvalue_differs__["a" /* KeyValueDiffers */])) {
            return this._KeyValueDiffers_30;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_16__angular_platform_browser_src_dom_shared_styles_host__["b" /* SharedStylesHost */])) {
            return this._SharedStylesHost_31;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_21__angular_platform_browser_src_browser_title__["a" /* Title */])) {
            return this._Title_32;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_22__angular_forms_src_directives_radio_control_value_accessor__["a" /* RadioControlRegistry */])) {
            return this._RadioControlRegistry_33;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_23__angular_http_src_backends_browser_xhr__["a" /* BrowserXhr */])) {
            return this._BrowserXhr_34;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_24__angular_http_src_base_response_options__["b" /* ResponseOptions */])) {
            return this._ResponseOptions_35;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_43__angular_http_src_interfaces__["a" /* XSRFStrategy */])) {
            return this._XSRFStrategy_36;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_25__angular_http_src_backends_xhr_backend__["a" /* XHRBackend */])) {
            return this._XHRBackend_37;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_26__angular_http_src_base_request_options__["b" /* RequestOptions */])) {
            return this._RequestOptions_38;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_44__angular_http_src_http__["a" /* Http */])) {
            return this._Http_39;
        }
        if ((token === __WEBPACK_IMPORTED_MODULE_27__app_gridster_gridster_prototype_gridster_prototype_service__["a" /* GridsterPrototypeService */])) {
            return this._GridsterPrototypeService_40;
        }
        return notFoundResult;
    };
    AppModuleInjector.prototype.destroyInternal = function () {
        this._ApplicationRef__13.ngOnDestroy();
        this._DomSharedStylesHost_21.ngOnDestroy();
    };
    return AppModuleInjector;
}(__WEBPACK_IMPORTED_MODULE_0__angular_core_src_linker_ng_module_factory__["a" /* NgModuleInjector */]));
var AppModuleNgFactory = new __WEBPACK_IMPORTED_MODULE_0__angular_core_src_linker_ng_module_factory__["b" /* NgModuleFactory */](AppModuleInjector, __WEBPACK_IMPORTED_MODULE_1__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=app.module.ngfactory.js.map

/***/ }),

/***/ 350:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_item_gridster_item_component__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core_src_metadata_view__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core_src_linker_view_type__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_core_src_change_detection_constants__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_core_src_linker_component_factory__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_core_src_linker_element_ref__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_gridster_gridster_service__ = __webpack_require__(64);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Wrapper_GridsterItemComponent; });
/* unused harmony export GridsterItemComponentNgFactory */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return View_GridsterItemComponent0; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};










var Wrapper_GridsterItemComponent = (function () {
    function Wrapper_GridsterItemComponent(p0, p1, p2) {
        this._changed = false;
        this._changes = {};
        this.context = new __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_item_gridster_item_component__["a" /* GridsterItemComponent */](p0, p1, p2);
        this._expr_0 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_1 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_2 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_3 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_4 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_5 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
    }
    Wrapper_GridsterItemComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_GridsterItemComponent.prototype.ngOnDestroy = function () {
        this.context.ngOnDestroy();
        (this.subscription0 && this.subscription0.unsubscribe());
        (this.subscription1 && this.subscription1.unsubscribe());
        (this.subscription2 && this.subscription2.unsubscribe());
        (this.subscription3 && this.subscription3.unsubscribe());
    };
    Wrapper_GridsterItemComponent.prototype.check_x = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_0, currValue))) {
            this._changed = true;
            this.context.x = currValue;
            this._changes['x'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_0, currValue);
            this._expr_0 = currValue;
        }
    };
    Wrapper_GridsterItemComponent.prototype.check_y = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_1, currValue))) {
            this._changed = true;
            this.context.y = currValue;
            this._changes['y'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_1, currValue);
            this._expr_1 = currValue;
        }
    };
    Wrapper_GridsterItemComponent.prototype.check_w = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_2, currValue))) {
            this._changed = true;
            this.context.w = currValue;
            this._changes['w'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_2, currValue);
            this._expr_2 = currValue;
        }
    };
    Wrapper_GridsterItemComponent.prototype.check_h = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_3, currValue))) {
            this._changed = true;
            this.context.h = currValue;
            this._changes['h'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_3, currValue);
            this._expr_3 = currValue;
        }
    };
    Wrapper_GridsterItemComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if (changed) {
                this.context.ngOnChanges(this._changes);
                this._changes = {};
            }
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_GridsterItemComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
        var currVal_4 = this.context.isDragging;
        if (__WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_4, currVal_4)) {
            view.renderer.setElementClass(el, 'is-dragging', currVal_4);
            this._expr_4 = currVal_4;
        }
        var currVal_5 = this.context.isResizing;
        if (__WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_5, currVal_5)) {
            view.renderer.setElementClass(el, 'is-resizing', currVal_5);
            this._expr_5 = currVal_5;
        }
    };
    Wrapper_GridsterItemComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_GridsterItemComponent.prototype.subscribe = function (view, _eventHandler, emit0, emit1, emit2, emit3) {
        this._eventHandler = _eventHandler;
        if (emit0) {
            (this.subscription0 = this.context.xChange.subscribe(_eventHandler.bind(view, 'xChange')));
        }
        if (emit1) {
            (this.subscription1 = this.context.yChange.subscribe(_eventHandler.bind(view, 'yChange')));
        }
        if (emit2) {
            (this.subscription2 = this.context.wChange.subscribe(_eventHandler.bind(view, 'wChange')));
        }
        if (emit3) {
            (this.subscription3 = this.context.hChange.subscribe(_eventHandler.bind(view, 'hChange')));
        }
    };
    return Wrapper_GridsterItemComponent;
}());
var renderType_GridsterItemComponent_Host = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderComponentType"]('', 0, __WEBPACK_IMPORTED_MODULE_4__angular_core_src_metadata_view__["b" /* ViewEncapsulation */].None, [], {});
var View_GridsterItemComponent_Host0 = (function (_super) {
    __extends(View_GridsterItemComponent_Host0, _super);
    function View_GridsterItemComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_GridsterItemComponent_Host0, renderType_GridsterItemComponent_Host, __WEBPACK_IMPORTED_MODULE_5__angular_core_src_linker_view_type__["a" /* ViewType */].HOST, viewUtils, parentView, parentIndex, parentElement, __WEBPACK_IMPORTED_MODULE_6__angular_core_src_change_detection_constants__["b" /* ChangeDetectorStatus */].CheckAlways);
    }
    View_GridsterItemComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["selectOrCreateRenderHostElement"](this.renderer, 'gridster-item', __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], rootSelector, null);
        this.compView_0 = new View_GridsterItemComponent0(this.viewUtils, this, 0, this._el_0);
        this._GridsterItemComponent_0_3 = new Wrapper_GridsterItemComponent(this.compView_0.ref, new __WEBPACK_IMPORTED_MODULE_8__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_0), this.injectorGet(__WEBPACK_IMPORTED_MODULE_9__app_gridster_gridster_service__["a" /* GridsterService */], this.parentIndex));
        this.compView_0.create(this._GridsterItemComponent_0_3.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new __WEBPACK_IMPORTED_MODULE_7__angular_core_src_linker_component_factory__["a" /* ComponentRef_ */](0, this, this._el_0, this._GridsterItemComponent_0_3.context);
    };
    View_GridsterItemComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_item_gridster_item_component__["a" /* GridsterItemComponent */]) && (0 === requestNodeIndex))) {
            return this._GridsterItemComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_GridsterItemComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        if (this._GridsterItemComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange)) {
            this.compView_0.markAsCheckOnce();
        }
        this._GridsterItemComponent_0_3.checkHost(this, this.compView_0, this._el_0, throwOnChange);
        this.compView_0.internalDetectChanges(throwOnChange);
        if (!throwOnChange) {
            if ((this.numberOfChecks === 0)) {
                this._GridsterItemComponent_0_3.context.ngAfterViewInit();
            }
        }
    };
    View_GridsterItemComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
        this._GridsterItemComponent_0_3.ngOnDestroy();
    };
    View_GridsterItemComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_GridsterItemComponent_Host0.prototype.visitProjectableNodesInternal = function (nodeIndex, ngContentIndex, cb, ctx) {
        if (((nodeIndex == 0) && (ngContentIndex == 0))) { }
    };
    return View_GridsterItemComponent_Host0;
}(__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view__["a" /* AppView */]));
var GridsterItemComponentNgFactory = new __WEBPACK_IMPORTED_MODULE_7__angular_core_src_linker_component_factory__["b" /* ComponentFactory */]('gridster-item', View_GridsterItemComponent_Host0, __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_item_gridster_item_component__["a" /* GridsterItemComponent */]);
var styles_GridsterItemComponent = ['[_nghost-%COMP%] {\n        display: block;\n        position: absolute;\n        top: 0;\n        left: 0;\n        z-index: 1;\n        cursor: pointer;\n        -webkit-transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, font-size 0.2s, line-height 0.2s;\n        transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, font-size 0.2s, line-height 0.2s;\n    }\n\n    .is-dragging[_nghost-%COMP%], .is-resizing[_nghost-%COMP%] {\n        -webkit-transition: none;\n        transition: none;\n        z-index: 9999;\n    }\n\n    .no-transition[_nghost-%COMP%] {\n        -webkit-transition: none;\n        transition: none;\n    }\n    .gridster-item-resizable-handler[_ngcontent-%COMP%] {\n        position: absolute;\n        z-index: 2;\n        display: none;\n    }\n\n    .gridster-item-resizable-handler.handle-n[_ngcontent-%COMP%] {\n      cursor: n-resize;\n      height: 10px;\n      right: 0;\n      top: 0;\n      left: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-e[_ngcontent-%COMP%] {\n      cursor: e-resize;\n      width: 10px;\n      bottom: 0;\n      right: 0;\n      top: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-s[_ngcontent-%COMP%] {\n      cursor: s-resize;\n      height: 10px;\n      right: 0;\n      bottom: 0;\n      left: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-w[_ngcontent-%COMP%] {\n      cursor: w-resize;\n      width: 10px;\n      left: 0;\n      top: 0;\n      bottom: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-ne[_ngcontent-%COMP%] {\n      cursor: ne-resize;\n      width: 10px;\n      height: 10px;\n      right: 0;\n      top: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-nw[_ngcontent-%COMP%] {\n      cursor: nw-resize;\n      width: 10px;\n      height: 10px;\n      left: 0;\n      top: 0;\n    }\n\n    .gridster-item-resizable-handler.handle-se[_ngcontent-%COMP%] {\n      cursor: se-resize;\n      width: 0;\n      height: 0;\n      right: 0;\n      bottom: 0;\n      border-style: solid;\n      border-width: 0 0 10px 10px;\n      border-color: transparent;\n    }\n\n    .gridster-item-resizable-handler.handle-sw[_ngcontent-%COMP%] {\n      cursor: sw-resize;\n      width: 10px;\n      height: 10px;\n      left: 0;\n      bottom: 0;\n    }\n\n    [_nghost-%COMP%]:hover   .gridster-item-resizable-handler.handle-se[_ngcontent-%COMP%] {\n      border-color: transparent transparent #ccc\n    }'];
var renderType_GridsterItemComponent = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderComponentType"]('', 1, __WEBPACK_IMPORTED_MODULE_4__angular_core_src_metadata_view__["b" /* ViewEncapsulation */].Emulated, styles_GridsterItemComponent, {});
var View_GridsterItemComponent0 = (function (_super) {
    __extends(View_GridsterItemComponent0, _super);
    function View_GridsterItemComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_GridsterItemComponent0, renderType_GridsterItemComponent, __WEBPACK_IMPORTED_MODULE_5__angular_core_src_linker_view_type__["a" /* ViewType */].COMPONENT, viewUtils, parentView, parentIndex, parentElement, __WEBPACK_IMPORTED_MODULE_6__angular_core_src_change_detection_constants__["b" /* ChangeDetectorStatus */].CheckOnce);
    }
    View_GridsterItemComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._el_0 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, parentRenderNode, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-item-inner'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n      ', null);
        this.projectNodes(this._el_0, 0);
        this._text_2 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_3 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_0, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-item-resizable-handler handle-s'), null);
        this._text_4 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_5 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_0, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-item-resizable-handler handle-e'), null);
        this._text_6 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_7 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_0, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-item-resizable-handler handle-n'), null);
        this._text_8 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_9 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_0, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-item-resizable-handler handle-w'), null);
        this._text_10 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_11 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_0, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-item-resizable-handler handle-se'), null);
        this._text_12 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_13 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_0, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-item-resizable-handler handle-ne'), null);
        this._text_14 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_15 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_0, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-item-resizable-handler handle-sw'), null);
        this._text_16 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_17 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_0, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-item-resizable-handler handle-nw'), null);
        this._text_18 = this.renderer.createText(this._el_0, '\n    ', null);
        this.init(null, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._text_2,
            this._el_3,
            this._text_4,
            this._el_5,
            this._text_6,
            this._el_7,
            this._text_8,
            this._el_9,
            this._text_10,
            this._el_11,
            this._text_12,
            this._el_13,
            this._text_14,
            this._el_15,
            this._text_16,
            this._el_17,
            this._text_18
        ]), null);
        return null;
    };
    return View_GridsterItemComponent0;
}(__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view__["a" /* AppView */]));
//# sourceMappingURL=gridster-item.component.ngfactory.js.map

/***/ }),

/***/ 351:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_prototype_gridster_item_prototype_directive__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__ = __webpack_require__(16);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Wrapper_GridsterItemPrototypeDirective; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */



var Wrapper_GridsterItemPrototypeDirective = (function () {
    function Wrapper_GridsterItemPrototypeDirective(p0, p1) {
        this._changed = false;
        this.context = new __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_prototype_gridster_item_prototype_directive__["a" /* GridsterItemPrototypeDirective */](p0, p1);
        this._expr_0 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_1 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_2 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_3 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
    }
    Wrapper_GridsterItemPrototypeDirective.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_GridsterItemPrototypeDirective.prototype.ngOnDestroy = function () {
        this.context.ngOnDestroy();
        (this.subscription0 && this.subscription0.unsubscribe());
        (this.subscription1 && this.subscription1.unsubscribe());
        (this.subscription2 && this.subscription2.unsubscribe());
        (this.subscription3 && this.subscription3.unsubscribe());
        (this.subscription4 && this.subscription4.unsubscribe());
    };
    Wrapper_GridsterItemPrototypeDirective.prototype.check_data = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_0, currValue))) {
            this._changed = true;
            this.context.data = currValue;
            this._expr_0 = currValue;
        }
    };
    Wrapper_GridsterItemPrototypeDirective.prototype.check_config = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_1, currValue))) {
            this._changed = true;
            this.context.config = currValue;
            this._expr_1 = currValue;
        }
    };
    Wrapper_GridsterItemPrototypeDirective.prototype.check_w = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_2, currValue))) {
            this._changed = true;
            this.context.w = currValue;
            this._expr_2 = currValue;
        }
    };
    Wrapper_GridsterItemPrototypeDirective.prototype.check_h = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_3, currValue))) {
            this._changed = true;
            this.context.h = currValue;
            this._expr_3 = currValue;
        }
    };
    Wrapper_GridsterItemPrototypeDirective.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_GridsterItemPrototypeDirective.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_GridsterItemPrototypeDirective.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_GridsterItemPrototypeDirective.prototype.subscribe = function (view, _eventHandler, emit0, emit1, emit2, emit3, emit4) {
        this._eventHandler = _eventHandler;
        if (emit0) {
            (this.subscription0 = this.context.drop.subscribe(_eventHandler.bind(view, 'drop')));
        }
        if (emit1) {
            (this.subscription1 = this.context.start.subscribe(_eventHandler.bind(view, 'start')));
        }
        if (emit2) {
            (this.subscription2 = this.context.cancel.subscribe(_eventHandler.bind(view, 'cancel')));
        }
        if (emit3) {
            (this.subscription3 = this.context.enter.subscribe(_eventHandler.bind(view, 'enter')));
        }
        if (emit4) {
            (this.subscription4 = this.context.out.subscribe(_eventHandler.bind(view, 'out')));
        }
    };
    return Wrapper_GridsterItemPrototypeDirective;
}());
//# sourceMappingURL=gridster-item-prototype.directive.ngfactory.js.map

/***/ }),

/***/ 352:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_component__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core_src_metadata_view__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_gridster_gridster_service__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_core_src_linker_view_type__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_core_src_change_detection_constants__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_core_src_linker_component_factory__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_core_src_linker_element_ref__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_gridster_gridster_prototype_gridster_prototype_service__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_core_src_linker_query_list__ = __webpack_require__(134);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Wrapper_GridsterComponent; });
/* unused harmony export GridsterComponentNgFactory */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return View_GridsterComponent0; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};












var Wrapper_GridsterComponent = (function () {
    function Wrapper_GridsterComponent(p0, p1, p2, p3) {
        this._changed = false;
        this.context = new __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_component__["a" /* GridsterComponent */](p0, p1, p2, p3);
        this._expr_0 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_1 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_2 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_3 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
    }
    Wrapper_GridsterComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_GridsterComponent.prototype.ngOnDestroy = function () {
        this.context.ngOnDestroy();
        (this.subscription0 && this.subscription0.unsubscribe());
        (this.subscription1 && this.subscription1.unsubscribe());
    };
    Wrapper_GridsterComponent.prototype.check_options = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_0, currValue))) {
            this._changed = true;
            this.context.options = currValue;
            this._expr_0 = currValue;
        }
    };
    Wrapper_GridsterComponent.prototype.check_draggableOptions = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_1, currValue))) {
            this._changed = true;
            this.context.draggableOptions = currValue;
            this._expr_1 = currValue;
        }
    };
    Wrapper_GridsterComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_GridsterComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
        var currVal_2 = this.context.isDragging;
        if (__WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_2, currVal_2)) {
            view.renderer.setElementClass(el, 'gridster--dragging', currVal_2);
            this._expr_2 = currVal_2;
        }
        var currVal_3 = this.context.isResizing;
        if (__WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_3, currVal_3)) {
            view.renderer.setElementClass(el, 'gridster--resizing', currVal_3);
            this._expr_3 = currVal_3;
        }
    };
    Wrapper_GridsterComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_GridsterComponent.prototype.subscribe = function (view, _eventHandler, emit0, emit1) {
        this._eventHandler = _eventHandler;
        if (emit0) {
            (this.subscription0 = this.context.gridsterPositionChange.subscribe(_eventHandler.bind(view, 'gridsterPositionChange')));
        }
        if (emit1) {
            (this.subscription1 = this.context.resize.subscribe(_eventHandler.bind(view, 'resize')));
        }
    };
    return Wrapper_GridsterComponent;
}());
var renderType_GridsterComponent_Host = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderComponentType"]('', 0, __WEBPACK_IMPORTED_MODULE_4__angular_core_src_metadata_view__["b" /* ViewEncapsulation */].None, [], {});
var View_GridsterComponent_Host0 = (function (_super) {
    __extends(View_GridsterComponent_Host0, _super);
    function View_GridsterComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_GridsterComponent_Host0, renderType_GridsterComponent_Host, __WEBPACK_IMPORTED_MODULE_6__angular_core_src_linker_view_type__["a" /* ViewType */].HOST, viewUtils, parentView, parentIndex, parentElement, __WEBPACK_IMPORTED_MODULE_7__angular_core_src_change_detection_constants__["b" /* ChangeDetectorStatus */].CheckAlways);
    }
    View_GridsterComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["selectOrCreateRenderHostElement"](this.renderer, 'gridster', __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["EMPTY_INLINE_ARRAY"], rootSelector, null);
        this.compView_0 = new View_GridsterComponent0(this.viewUtils, this, 0, this._el_0);
        this._GridsterService_0_3 = new __WEBPACK_IMPORTED_MODULE_5__app_gridster_gridster_service__["a" /* GridsterService */]();
        this._GridsterComponent_0_4 = new Wrapper_GridsterComponent(new __WEBPACK_IMPORTED_MODULE_9__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_0), this._GridsterService_0_3, this.compView_0.ref, this.injectorGet(__WEBPACK_IMPORTED_MODULE_10__app_gridster_gridster_prototype_gridster_prototype_service__["a" /* GridsterPrototypeService */], this.parentIndex));
        this.compView_0.create(this._GridsterComponent_0_4.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new __WEBPACK_IMPORTED_MODULE_8__angular_core_src_linker_component_factory__["a" /* ComponentRef_ */](0, this, this._el_0, this._GridsterComponent_0_4.context);
    };
    View_GridsterComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === __WEBPACK_IMPORTED_MODULE_5__app_gridster_gridster_service__["a" /* GridsterService */]) && (0 === requestNodeIndex))) {
            return this._GridsterService_0_3;
        }
        if (((token === __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_component__["a" /* GridsterComponent */]) && (0 === requestNodeIndex))) {
            return this._GridsterComponent_0_4.context;
        }
        return notFoundResult;
    };
    View_GridsterComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._GridsterComponent_0_4.ngDoCheck(this, this._el_0, throwOnChange);
        this._GridsterComponent_0_4.checkHost(this, this.compView_0, this._el_0, throwOnChange);
        this.compView_0.internalDetectChanges(throwOnChange);
        if (!throwOnChange) {
            if ((this.numberOfChecks === 0)) {
                this._GridsterComponent_0_4.context.ngAfterViewInit();
            }
        }
    };
    View_GridsterComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
        this._GridsterComponent_0_4.ngOnDestroy();
    };
    View_GridsterComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_GridsterComponent_Host0.prototype.visitProjectableNodesInternal = function (nodeIndex, ngContentIndex, cb, ctx) {
        if (((nodeIndex == 0) && (ngContentIndex == 0))) { }
    };
    return View_GridsterComponent_Host0;
}(__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view__["a" /* AppView */]));
var GridsterComponentNgFactory = new __WEBPACK_IMPORTED_MODULE_8__angular_core_src_linker_component_factory__["b" /* ComponentFactory */]('gridster', View_GridsterComponent_Host0, __WEBPACK_IMPORTED_MODULE_0__app_gridster_gridster_component__["a" /* GridsterComponent */]);
var styles_GridsterComponent = ['[_nghost-%COMP%] {\n        position: relative;\n        display: block;\n        left: 0;\n        width: 100%;\n    }\n\n    .gridster--dragging[_nghost-%COMP%] {\n        -moz-user-select: none;\n        -khtml-user-select: none;\n        -webkit-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n    }\n\n    .gridster-container[_ngcontent-%COMP%] {\n        position: relative;\n        width: 100%;\n        list-style: none;\n        -webkit-transition: width 0.2s, height 0.2s;\n        transition: width 0.2s, height 0.2s;\n    }\n\n    .position-highlight[_ngcontent-%COMP%] {\n        display: block;\n        position: absolute;\n        z-index: 1;\n    }'];
var renderType_GridsterComponent = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderComponentType"]('', 1, __WEBPACK_IMPORTED_MODULE_4__angular_core_src_metadata_view__["b" /* ViewEncapsulation */].Emulated, styles_GridsterComponent, {});
var View_GridsterComponent0 = (function (_super) {
    __extends(View_GridsterComponent0, _super);
    function View_GridsterComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_GridsterComponent0, renderType_GridsterComponent, __WEBPACK_IMPORTED_MODULE_6__angular_core_src_linker_view_type__["a" /* ViewType */].COMPONENT, viewUtils, parentView, parentIndex, parentElement, __WEBPACK_IMPORTED_MODULE_7__angular_core_src_change_detection_constants__["b" /* ChangeDetectorStatus */].CheckAlways);
    }
    View_GridsterComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._viewQuery_positionHighlight_0 = new __WEBPACK_IMPORTED_MODULE_11__angular_core_src_linker_query_list__["a" /* QueryList */]();
        this._el_0 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, parentRenderNode, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'gridster-container'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n      ', null);
        this.projectNodes(this._el_0, 0);
        this._text_2 = this.renderer.createText(this._el_0, '\n      ', null);
        this._el_3 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_0, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray4"](4, 'class', 'position-highlight', 'style', 'display:none;'), null);
        this._text_4 = this.renderer.createText(this._el_3, '\n        ', null);
        this._el_5 = __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["createRenderElement"](this.renderer, this._el_3, 'div', new __WEBPACK_IMPORTED_MODULE_3__angular_core_src_linker_view_utils__["InlineArray2"](2, 'class', 'inner'), null);
        this._text_6 = this.renderer.createText(this._el_3, '\n      ', null);
        this._text_7 = this.renderer.createText(this._el_0, '\n    ', null);
        this._viewQuery_positionHighlight_0.reset([new __WEBPACK_IMPORTED_MODULE_9__angular_core_src_linker_element_ref__["a" /* ElementRef */](this._el_3)]);
        this.context.$positionHighlight = this._viewQuery_positionHighlight_0.first;
        this.init(null, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._text_2,
            this._el_3,
            this._text_4,
            this._el_5,
            this._text_6,
            this._text_7
        ]), null);
        return null;
    };
    return View_GridsterComponent0;
}(__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view__["a" /* AppView */]));
//# sourceMappingURL=gridster.component.ngfactory.js.map

/***/ }),

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_src_directives_ng_for__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__ = __webpack_require__(16);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Wrapper_NgFor; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */



var Wrapper_NgFor = (function () {
    function Wrapper_NgFor(p0, p1, p2, p3) {
        this._changed = false;
        this._changes = {};
        this.context = new __WEBPACK_IMPORTED_MODULE_0__angular_common_src_directives_ng_for__["a" /* NgFor */](p0, p1, p2, p3);
        this._expr_0 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_1 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_2 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
    }
    Wrapper_NgFor.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_NgFor.prototype.ngOnDestroy = function () {
    };
    Wrapper_NgFor.prototype.check_ngForOf = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_0, currValue))) {
            this._changed = true;
            this.context.ngForOf = currValue;
            this._changes['ngForOf'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_0, currValue);
            this._expr_0 = currValue;
        }
    };
    Wrapper_NgFor.prototype.check_ngForTrackBy = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_1, currValue))) {
            this._changed = true;
            this.context.ngForTrackBy = currValue;
            this._changes['ngForTrackBy'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_1, currValue);
            this._expr_1 = currValue;
        }
    };
    Wrapper_NgFor.prototype.check_ngForTemplate = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_2, currValue))) {
            this._changed = true;
            this.context.ngForTemplate = currValue;
            this._changes['ngForTemplate'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_2, currValue);
            this._expr_2 = currValue;
        }
    };
    Wrapper_NgFor.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if (changed) {
                this.context.ngOnChanges(this._changes);
                this._changes = {};
            }
            this.context.ngDoCheck();
        }
        return changed;
    };
    Wrapper_NgFor.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_NgFor.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_NgFor.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_NgFor;
}());
//# sourceMappingURL=ng_for.ngfactory.js.map

/***/ }),

/***/ 354:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_checkbox_value_accessor__ = __webpack_require__(59);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Wrapper_CheckboxControlValueAccessor; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */

var Wrapper_CheckboxControlValueAccessor = (function () {
    function Wrapper_CheckboxControlValueAccessor(p0, p1) {
        this._changed = false;
        this.context = new __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_checkbox_value_accessor__["a" /* CheckboxControlValueAccessor */](p0, p1);
    }
    Wrapper_CheckboxControlValueAccessor.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_CheckboxControlValueAccessor.prototype.ngOnDestroy = function () {
    };
    Wrapper_CheckboxControlValueAccessor.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        return changed;
    };
    Wrapper_CheckboxControlValueAccessor.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_CheckboxControlValueAccessor.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        if ((eventName == 'change')) {
            var pd_sub_0 = (this.context.onChange($event.target.checked) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'blur')) {
            var pd_sub_1 = (this.context.onTouched() !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    Wrapper_CheckboxControlValueAccessor.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_CheckboxControlValueAccessor;
}());
//# sourceMappingURL=checkbox_value_accessor.ngfactory.js.map

/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_default_value_accessor__ = __webpack_require__(60);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Wrapper_DefaultValueAccessor; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */

var Wrapper_DefaultValueAccessor = (function () {
    function Wrapper_DefaultValueAccessor(p0, p1) {
        this._changed = false;
        this.context = new __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_default_value_accessor__["a" /* DefaultValueAccessor */](p0, p1);
    }
    Wrapper_DefaultValueAccessor.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_DefaultValueAccessor.prototype.ngOnDestroy = function () {
    };
    Wrapper_DefaultValueAccessor.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        return changed;
    };
    Wrapper_DefaultValueAccessor.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_DefaultValueAccessor.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        if ((eventName == 'input')) {
            var pd_sub_0 = (this.context.onChange($event.target.value) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'blur')) {
            var pd_sub_1 = (this.context.onTouched() !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    Wrapper_DefaultValueAccessor.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_DefaultValueAccessor;
}());
//# sourceMappingURL=default_value_accessor.ngfactory.js.map

/***/ }),

/***/ 356:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_ng_control_status__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__ = __webpack_require__(16);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Wrapper_NgControlStatus; });
/* unused harmony export Wrapper_NgControlStatusGroup */
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */



var Wrapper_NgControlStatus = (function () {
    function Wrapper_NgControlStatus(p0) {
        this._changed = false;
        this.context = new __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_ng_control_status__["a" /* NgControlStatus */](p0);
        this._expr_0 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_1 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_2 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_3 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_4 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_5 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_6 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
    }
    Wrapper_NgControlStatus.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_NgControlStatus.prototype.ngOnDestroy = function () {
    };
    Wrapper_NgControlStatus.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        return changed;
    };
    Wrapper_NgControlStatus.prototype.checkHost = function (view, componentView, el, throwOnChange) {
        var currVal_0 = this.context.ngClassUntouched;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_0, currVal_0)) {
            view.renderer.setElementClass(el, 'ng-untouched', currVal_0);
            this._expr_0 = currVal_0;
        }
        var currVal_1 = this.context.ngClassTouched;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_1, currVal_1)) {
            view.renderer.setElementClass(el, 'ng-touched', currVal_1);
            this._expr_1 = currVal_1;
        }
        var currVal_2 = this.context.ngClassPristine;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_2, currVal_2)) {
            view.renderer.setElementClass(el, 'ng-pristine', currVal_2);
            this._expr_2 = currVal_2;
        }
        var currVal_3 = this.context.ngClassDirty;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_3, currVal_3)) {
            view.renderer.setElementClass(el, 'ng-dirty', currVal_3);
            this._expr_3 = currVal_3;
        }
        var currVal_4 = this.context.ngClassValid;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_4, currVal_4)) {
            view.renderer.setElementClass(el, 'ng-valid', currVal_4);
            this._expr_4 = currVal_4;
        }
        var currVal_5 = this.context.ngClassInvalid;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_5, currVal_5)) {
            view.renderer.setElementClass(el, 'ng-invalid', currVal_5);
            this._expr_5 = currVal_5;
        }
        var currVal_6 = this.context.ngClassPending;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_6, currVal_6)) {
            view.renderer.setElementClass(el, 'ng-pending', currVal_6);
            this._expr_6 = currVal_6;
        }
    };
    Wrapper_NgControlStatus.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_NgControlStatus.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_NgControlStatus;
}());
var Wrapper_NgControlStatusGroup = (function () {
    function Wrapper_NgControlStatusGroup(p0) {
        this._changed = false;
        this.context = new __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_ng_control_status__["b" /* NgControlStatusGroup */](p0);
        this._expr_0 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_1 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_2 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_3 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_4 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_5 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_6 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
    }
    Wrapper_NgControlStatusGroup.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_NgControlStatusGroup.prototype.ngOnDestroy = function () {
    };
    Wrapper_NgControlStatusGroup.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        return changed;
    };
    Wrapper_NgControlStatusGroup.prototype.checkHost = function (view, componentView, el, throwOnChange) {
        var currVal_0 = this.context.ngClassUntouched;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_0, currVal_0)) {
            view.renderer.setElementClass(el, 'ng-untouched', currVal_0);
            this._expr_0 = currVal_0;
        }
        var currVal_1 = this.context.ngClassTouched;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_1, currVal_1)) {
            view.renderer.setElementClass(el, 'ng-touched', currVal_1);
            this._expr_1 = currVal_1;
        }
        var currVal_2 = this.context.ngClassPristine;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_2, currVal_2)) {
            view.renderer.setElementClass(el, 'ng-pristine', currVal_2);
            this._expr_2 = currVal_2;
        }
        var currVal_3 = this.context.ngClassDirty;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_3, currVal_3)) {
            view.renderer.setElementClass(el, 'ng-dirty', currVal_3);
            this._expr_3 = currVal_3;
        }
        var currVal_4 = this.context.ngClassValid;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_4, currVal_4)) {
            view.renderer.setElementClass(el, 'ng-valid', currVal_4);
            this._expr_4 = currVal_4;
        }
        var currVal_5 = this.context.ngClassInvalid;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_5, currVal_5)) {
            view.renderer.setElementClass(el, 'ng-invalid', currVal_5);
            this._expr_5 = currVal_5;
        }
        var currVal_6 = this.context.ngClassPending;
        if (__WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_6, currVal_6)) {
            view.renderer.setElementClass(el, 'ng-pending', currVal_6);
            this._expr_6 = currVal_6;
        }
    };
    Wrapper_NgControlStatusGroup.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_NgControlStatusGroup.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_NgControlStatusGroup;
}());
//# sourceMappingURL=ng_control_status.ngfactory.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_ng_model__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__ = __webpack_require__(16);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Wrapper_NgModel; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */



var Wrapper_NgModel = (function () {
    function Wrapper_NgModel(p0, p1, p2, p3) {
        this._changed = false;
        this._changes = {};
        this.context = new __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_ng_model__["a" /* NgModel */](p0, p1, p2, p3);
        this._expr_0 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_1 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_2 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_3 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
    }
    Wrapper_NgModel.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_NgModel.prototype.ngOnDestroy = function () {
        this.context.ngOnDestroy();
        (this.subscription0 && this.subscription0.unsubscribe());
    };
    Wrapper_NgModel.prototype.check_name = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_0, currValue))) {
            this._changed = true;
            this.context.name = currValue;
            this._changes['name'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_0, currValue);
            this._expr_0 = currValue;
        }
    };
    Wrapper_NgModel.prototype.check_isDisabled = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_1, currValue))) {
            this._changed = true;
            this.context.isDisabled = currValue;
            this._changes['isDisabled'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_1, currValue);
            this._expr_1 = currValue;
        }
    };
    Wrapper_NgModel.prototype.check_model = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_2, currValue))) {
            this._changed = true;
            this.context.model = currValue;
            this._changes['model'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_2, currValue);
            this._expr_2 = currValue;
        }
    };
    Wrapper_NgModel.prototype.check_options = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_3, currValue))) {
            this._changed = true;
            this.context.options = currValue;
            this._changes['options'] = new __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["e" /* SimpleChange */](this._expr_3, currValue);
            this._expr_3 = currValue;
        }
    };
    Wrapper_NgModel.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if (changed) {
                this.context.ngOnChanges(this._changes);
                this._changes = {};
            }
        }
        return changed;
    };
    Wrapper_NgModel.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_NgModel.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_NgModel.prototype.subscribe = function (view, _eventHandler, emit0) {
        this._eventHandler = _eventHandler;
        if (emit0) {
            (this.subscription0 = this.context.update.subscribe(_eventHandler.bind(view, 'ngModelChange')));
        }
    };
    return Wrapper_NgModel;
}());
//# sourceMappingURL=ng_model.ngfactory.js.map

/***/ }),

/***/ 358:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_radio_control_value_accessor__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__ = __webpack_require__(16);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Wrapper_RadioControlValueAccessor; });
/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */



var Wrapper_RadioControlValueAccessor = (function () {
    function Wrapper_RadioControlValueAccessor(p0, p1, p2, p3) {
        this._changed = false;
        this.context = new __WEBPACK_IMPORTED_MODULE_0__angular_forms_src_directives_radio_control_value_accessor__["b" /* RadioControlValueAccessor */](p0, p1, p2, p3);
        this._expr_0 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_1 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
        this._expr_2 = __WEBPACK_IMPORTED_MODULE_1__angular_core_src_change_detection_change_detection_util__["b" /* UNINITIALIZED */];
    }
    Wrapper_RadioControlValueAccessor.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_RadioControlValueAccessor.prototype.ngOnDestroy = function () {
        this.context.ngOnDestroy();
    };
    Wrapper_RadioControlValueAccessor.prototype.check_name = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_0, currValue))) {
            this._changed = true;
            this.context.name = currValue;
            this._expr_0 = currValue;
        }
    };
    Wrapper_RadioControlValueAccessor.prototype.check_formControlName = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_1, currValue))) {
            this._changed = true;
            this.context.formControlName = currValue;
            this._expr_1 = currValue;
        }
    };
    Wrapper_RadioControlValueAccessor.prototype.check_value = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || __WEBPACK_IMPORTED_MODULE_2__angular_core_src_linker_view_utils__["checkBinding"](throwOnChange, this._expr_2, currValue))) {
            this._changed = true;
            this.context.value = currValue;
            this._expr_2 = currValue;
        }
    };
    Wrapper_RadioControlValueAccessor.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_RadioControlValueAccessor.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_RadioControlValueAccessor.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        if ((eventName == 'change')) {
            var pd_sub_0 = (this.context.onChange() !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'blur')) {
            var pd_sub_1 = (this.context.onTouched() !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    Wrapper_RadioControlValueAccessor.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_RadioControlValueAccessor;
}());
//# sourceMappingURL=radio_control_value_accessor.ngfactory.js.map

/***/ }),

/***/ 359:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var AppComponent = (function () {
    function AppComponent() {
        this.gridsterOptions = {
            lanes: 5,
            direction: 'vertical',
            dragAndDrop: true,
            resizable: true,
            maxWidth: 3,
            maxHeight: 3
        };
        this.gridsterDraggableOptions = {
            handlerClass: 'panel-heading'
        };
        this.title = 'Angular2Gridster';
        this.widgets = [
            {
                x: 0, y: 0,
                w: 1, h: 2,
                title: 'Basic form inputs 1',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
                    'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
                    'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
                    'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
                    'laborum.'
            },
            {
                x: 1, y: 0, w: 2, h: 1,
                title: 'Basic form inputs 2',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
                    'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
                    'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
                    'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
                    'laborum.'
            },
            {
                x: 1, y: 1, w: 2, h: 1,
                title: 'Basic form inputs 3',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
                    'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
                    'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
                    'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
                    'laborum.'
            },
            {
                x: 3, y: 0, w: 1, h: 2,
                title: 'Basic form inputs 4',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
                    'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
                    'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
                    'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
                    'laborum.'
            }
        ];
    }
    AppComponent.prototype.onResize = function (event) {
        this.gridster.reload();
    };
    AppComponent.prototype.removeLine = function (gridster) {
        gridster.setOption('lanes', --this.gridsterOptions.lanes)
            .reload();
    };
    AppComponent.prototype.addLine = function (gridster) {
        gridster.setOption('lanes', ++this.gridsterOptions.lanes)
            .reload();
    };
    AppComponent.prototype.setWidth = function (widget, size, e) {
        e.stopPropagation();
        e.preventDefault();
        if (size < 1) {
            size = 1;
        }
        widget.w = size;
        return false;
    };
    AppComponent.prototype.setHeight = function (widget, size, e) {
        e.stopPropagation();
        e.preventDefault();
        if (size < 1) {
            size = 1;
        }
        widget.h = size;
        return false;
    };
    AppComponent.prototype.logChanges = function (items) {
        console.log('===>> Changed items: ', items);
    };
    AppComponent.prototype.swap = function () {
        this.widgets[0].x = 3;
        this.widgets[3].x = 0;
    };
    AppComponent.prototype.addWidgetFromDrag = function (gridster, event) {
        var item = event.item;
        this.widgets.push({
            x: item.x, y: item.y, w: item.w, h: item.h,
            title: 'Basic form inputs 5',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
                'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
                'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
                'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
                'laborum.'
        });
        console.log('add widget from drag to:', gridster);
    };
    AppComponent.prototype.over = function (event) {
        event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width =
            event.gridster.getItemWidth(event.item) + 'px';
        event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height =
            event.gridster.getItemHeight(event.item) + 'px';
        event.item.itemPrototype.$element.classList.add('is-over');
    };
    AppComponent.prototype.out = function (event) {
        event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width = '';
        event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height = '';
        event.item.itemPrototype.$element.classList.remove('is-over');
    };
    AppComponent.prototype.addWidgetWithoutData = function () {
        this.widgets.push({
            title: 'Basic form inputs X',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
                'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
                'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
                'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
                'laborum.'
        });
    };
    AppComponent.prototype.addWidget = function (gridster) {
        this.widgets.push({
            x: 4, y: 0, w: 1, h: 1,
            title: 'Basic form inputs 5',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
                'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
                'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
                'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ' +
                'laborum.'
        });
        console.log('widget push', this.widgets[this.widgets.length - 1]);
    };
    AppComponent.prototype.remove = function ($event, index, gridster) {
        $event.preventDefault();
        this.widgets.splice(index, 1);
        console.log('widget remove', index);
    };
    AppComponent.prototype.resize = function (item) {
        console.log('resize', item);
    };
    return AppComponent;
}());
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 360:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 361:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridList; });
var GridCol = function (lanes) {
    for (var i = 0; i < lanes; i++) {
        this.push(null);
    }
};
// Extend the Array prototype
GridCol.prototype = [];
/**
 * A GridList manages the two-dimensional positions from a list of items,
 * within a virtual matrix.
 *
 * The GridList's main function is to convert the item positions from one
 * grid size to another, maintaining as much of their order as possible.
 *
 * The GridList's second function is to handle collisions when moving an item
 * over another.
 *
 * The positioning algorithm places items in columns. Starting from left to
 * right, going through each column top to bottom.
 *
 * The size of an item is expressed using the number of cols and rows it
 * takes up within the grid (w and h)
 *
 * The position of an item is express using the col and row position within
 * the grid (x and y)
 *
 * An item is an object of structure:
 * {
   *   w: 3, h: 1,
   *   x: 0, y: 1
   * }
 */
var GridList = (function () {
    function GridList(items, options) {
        this.defaults = {
            lanes: 5,
            direction: 'horizontal'
        };
        this.options = options;
        for (var k in this.defaults) {
            if (!this.options.hasOwnProperty(k)) {
                this.options[k] = this.defaults[k];
            }
        }
        this.items = items;
        this.adjustSizeOfItems();
        this.generateGrid();
    }
    /**
     * Illustates grid as text-based table, using a number identifier for each
     * item. E.g.
     *
     *  #|  0  1  2  3  4  5  6  7  8  9 10 11 12 13
     *  --------------------------------------------
     *  0| 00 02 03 04 04 06 08 08 08 12 12 13 14 16
     *  1| 01 -- 03 05 05 07 09 10 11 11 -- 13 15 --
     *
     * Warn: Does not work if items don't have a width or height specified
     * besides their position in the grid.
     */
    GridList.prototype.toString = function () {
        var widthOfGrid = this.grid.length;
        var output = '\n #|', border = '\n --', item, i, j;
        // Render the table header
        for (i = 0; i < widthOfGrid; i++) {
            output += ' ' + this.padNumber(i, ' ');
            border += '---';
        }
        output += border;
        // Render table contents row by row, as we go on the y axis
        for (i = 0; i < this.options.lanes; i++) {
            output += '\n' + this.padNumber(i, ' ') + '|';
            for (j = 0; j < widthOfGrid; j++) {
                output += ' ';
                item = this.grid[j][i];
                output += item ? this.padNumber(this.items.indexOf(item), '0') : '--';
            }
        }
        output += '\n';
        return output;
    };
    GridList.prototype.setOption = function (name, value) {
        this.options[name] = value;
    };
    /**
     * Build the grid structure from scratch, with the current item positions
     */
    GridList.prototype.generateGrid = function () {
        var i;
        this.resetGrid();
        for (i = 0; i < this.items.length; i++) {
            this.markItemPositionToGrid(this.items[i]);
        }
    };
    GridList.prototype.resizeGrid = function (lanes) {
        var currentColumn = 0;
        this.options.lanes = lanes;
        this.adjustSizeOfItems();
        this.sortItemsByPosition();
        this.resetGrid();
        // The items will be sorted based on their index within the this.items array,
        // that is their "1d position"
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i], position = this.getItemPosition(item);
            this.updateItemPosition(item, this.findPositionForItem(item, { x: currentColumn, y: 0 }));
            // New items should never be placed to the left of previous items
            currentColumn = Math.max(currentColumn, position.x);
        }
        this.pullItemsToLeft();
    };
    /**
     * This method has two options for the position we want for the item:
     * - Starting from a certain row/column number and only looking for
     *   positions to its right
     * - Accepting positions for a certain row number only (use-case: items
     *   being shifted to the left/right as a result of collisions)
     *
     * @param {Object} item
     * @param {Object} start Position from which to start
     *     the search.
     * @param {number} [fixedRow] If provided, we're going to try to find a
     *     position for the new item on it. If doesn't fit there, we're going
     *     to put it on the first row.
     *
     * @returns {Array} x and y.
     */
    GridList.prototype.findPositionForItem = function (item, start, fixedRow) {
        var x, y, position;
        // Start searching for a position from the horizontal position of the
        // rightmost item from the grid
        for (x = start.x; x < this.grid.length; x++) {
            if (fixedRow !== undefined) {
                position = [x, fixedRow];
                if (this.itemFitsAtPosition(item, position)) {
                    return position;
                }
            }
            else {
                for (y = start.y; y < this.options.lanes; y++) {
                    position = [x, y];
                    if (this.itemFitsAtPosition(item, position)) {
                        return position;
                    }
                }
            }
        }
        // If we've reached this point, we need to start a new column
        var newCol = this.grid.length;
        var newRow = 0;
        if (fixedRow !== undefined &&
            this.itemFitsAtPosition(item, [newCol, fixedRow])) {
            newRow = fixedRow;
        }
        return [newCol, newRow];
    };
    GridList.prototype.moveAndResize = function (item, newPosition, size) {
        var position = this.getItemPosition({
            x: newPosition[0],
            y: newPosition[1],
            w: item.w,
            h: item.h
        });
        var width = size.w || item.w, height = size.h || item.h;
        this.updateItemPosition(item, [position.x, position.y]);
        this.updateItemSize(item, width, height);
        this.pullItemsToLeft(item);
    };
    GridList.prototype.moveItemToPosition = function (item, newPosition) {
        var position = this.getItemPosition({
            x: newPosition[0],
            y: newPosition[1],
            w: item.w,
            h: item.h
        });
        this.updateItemPosition(item, [position.x, position.y]);
        this.resolveCollisions(item);
    };
    /**
     * Resize an item and resolve collisions.
     *
     * @param {Object} item A reference to an item that's part of the grid.
     * @param {Object} size
     * @param {number} [size.w=item.w] The new width.
     * @param {number} [size.h=item.h] The new height.
     */
    GridList.prototype.resizeItem = function (item, size) {
        var width = size.w || item.w, height = size.h || item.h;
        this.updateItemSize(item, width, height);
        this.pullItemsToLeft(item);
    };
    /**
     * Compare the current items against a previous snapshot and return only
     * the ones that changed their attributes in the meantime. This includes both
     * position (x, y) and size (w, h)
     *
     * Since both their position and size can change, the items need an
     * additional identifier attribute to match them with their previous state
     */
    GridList.prototype.getChangedItems = function (initialItems, idAttribute) {
        var changedItems = [];
        for (var i = 0; i < initialItems.length; i++) {
            var item = this.getItemByAttribute(idAttribute, initialItems[i][idAttribute]);
            if (item.x !== initialItems[i].x ||
                item.y !== initialItems[i].y ||
                item.w !== initialItems[i].w ||
                item.h !== initialItems[i].h) {
                changedItems.push(item);
            }
        }
        return changedItems;
    };
    GridList.prototype.getChangedItemsMap = function (initialItems) {
        var changedItems = {
            x: [],
            y: [],
            w: [],
            h: []
        };
        for (var i = 0; i < initialItems.length; i++) {
            var item = this.getItemByAttribute('$element', initialItems[i].$element);
            if (item.x !== initialItems[i].x) {
                changedItems.x.push(item);
            }
            if (item.y !== initialItems[i].y) {
                changedItems.y.push(item);
            }
            if (item.w !== initialItems[i].w) {
                changedItems.w.push(item);
            }
            if (item.h !== initialItems[i].h) {
                changedItems.h.push(item);
            }
        }
        return changedItems;
    };
    GridList.prototype.resolveCollisions = function (item) {
        if (!this.tryToResolveCollisionsLocally(item)) {
            this.pullItemsToLeft(item);
        }
        this.pullItemsToLeft();
    };
    /**
     * Build the grid from scratch, by using the current item positions and
     * pulling them as much to the left as possible, removing as space between
     * them as possible.
     *
     * If a "fixed item" is provided, its position will be kept intact and the
     * rest of the items will be layed around it.
     */
    GridList.prototype.pullItemsToLeft = function (fixedItem) {
        // Start a fresh grid with the fixed item already placed inside
        this.sortItemsByPosition();
        this.resetGrid();
        // Start the grid with the fixed item as the first positioned item
        if (fixedItem) {
            var fixedPosition = this.getItemPosition(fixedItem);
            this.updateItemPosition(fixedItem, [fixedPosition.x, fixedPosition.y]);
        }
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i], position = this.getItemPosition(item);
            // The fixed item keeps its exact position
            if (fixedItem && item === fixedItem) {
                continue;
            }
            var x = this.findLeftMostPositionForItem(item), newPosition = this.findPositionForItem(item, { x: x, y: 0 }, position.y);
            this.updateItemPosition(item, newPosition);
        }
    };
    GridList.prototype.sortItemsByPosition = function () {
        var _this = this;
        this.items.sort(function (item1, item2) {
            var position1 = _this.getItemPosition(item1), position2 = _this.getItemPosition(item2);
            // Try to preserve columns.
            if (position1.x !== position2.x) {
                return position1.x - position2.x;
            }
            if (position1.y !== position2.y) {
                return position1.y - position2.y;
            }
            // The items are placed on the same position.
            return 0;
        });
    };
    /**
     * Some items can have 100% height or 100% width. Those dimmensions are
     * expressed as 0. We need to ensure a valid width and height for each of
     * those items as the number of items per lane.
     */
    GridList.prototype.adjustSizeOfItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            // This can happen only the first time items are checked.
            // We need the property to have a value for all the items so that the
            // `cloneItems` method will merge the properties properly. If we only set
            // it to the items that need it then the following can happen:
            //
            // cloneItems([{id: 1, autoSize: true}, {id: 2}],
            //            [{id: 2}, {id: 1, autoSize: true}]);
            //
            // will result in
            //
            // [{id: 1, autoSize: true}, {id: 2, autoSize: true}]
            if (item.autoSize === undefined) {
                item.autoSize = item.w === 0 || item.h === 0;
            }
            if (item.autoSize) {
                if (this.options.direction === 'horizontal') {
                    item.h = this.options.lanes;
                }
                else {
                    item.w = this.options.lanes;
                }
            }
        }
    };
    GridList.prototype.resetGrid = function () {
        this.grid = [];
    };
    /**
     * Check that an item wouldn't overlap with another one if placed at a
     * certain position within the grid
     */
    GridList.prototype.itemFitsAtPosition = function (item, newPosition) {
        var position = this.getItemPosition(item);
        var x, y;
        // No coordonate can be negative
        if (newPosition[0] < 0 || newPosition[1] < 0) {
            return false;
        }
        // Make sure the item isn't larger than the entire grid
        if (newPosition[1] + position.h > this.options.lanes) {
            return false;
        }
        // Make sure the position doesn't overlap with an already positioned
        // item.
        for (x = newPosition[0]; x < newPosition[0] + position.w; x++) {
            var col = this.grid[x];
            // Surely a column that hasn't even been created yet is available
            if (!col) {
                continue;
            }
            for (y = newPosition[1]; y < newPosition[1] + position.h; y++) {
                // Any space occupied by an item can continue to be occupied by the
                // same item.
                if (col[y] && col[y] !== item) {
                    return false;
                }
            }
        }
        return true;
    };
    GridList.prototype.updateItemPosition = function (item, position) {
        if (item.x !== null && item.y !== null) {
            this.deleteItemPositionFromGrid(item);
        }
        this.setItemPosition(item, position);
        this.markItemPositionToGrid(item);
    };
    /**
     * @param {Object} item A reference to a grid item.
     * @param {number} width The new width.
     * @param {number} height The new height.
     */
    GridList.prototype.updateItemSize = function (item, width, height) {
        if (item.x !== null && item.y !== null) {
            this.deleteItemPositionFromGrid(item);
        }
        item.w = width;
        item.h = height;
        this.markItemPositionToGrid(item);
    };
    /**
     * Mark the grid cells that are occupied by an item. This prevents items
     * from overlapping in the grid
     */
    GridList.prototype.markItemPositionToGrid = function (item) {
        var position = this.getItemPosition(item);
        var x, y;
        // Ensure that the grid has enough columns to accomodate the current item.
        this.ensureColumns(position.x + position.w);
        for (x = position.x; x < position.x + position.w; x++) {
            for (y = position.y; y < position.y + position.h; y++) {
                this.grid[x][y] = item;
            }
        }
    };
    GridList.prototype.deleteItemPositionFromGrid = function (item) {
        var position = this.getItemPosition(item);
        var x, y;
        for (x = position.x; x < position.x + position.w; x++) {
            // It can happen to try to remove an item from a position not generated
            // in the grid, probably when loading a persisted grid of items. No need
            // to create a column to be able to remove something from it, though
            if (!this.grid[x]) {
                continue;
            }
            for (y = position.y; y < position.y + position.h; y++) {
                // Don't clear the cell if it's been occupied by a different widget in
                // the meantime (e.g. when an item has been moved over this one, and
                // thus by continuing to clear this item's previous position you would
                // cancel the first item's move, leaving it without any position even)
                if (this.grid[x][y] === item) {
                    this.grid[x][y] = null;
                }
            }
        }
    };
    /**
     * Ensure that the grid has at least N columns available.
     */
    GridList.prototype.ensureColumns = function (N) {
        for (var i = 0; i < N; i++) {
            if (!this.grid[i]) {
                this.grid.push(new GridCol(this.options.lanes));
            }
        }
    };
    GridList.prototype.getItemsCollidingWithItem = function (item) {
        var collidingItems = [];
        for (var i = 0; i < this.items.length; i++) {
            if (item !== this.items[i] &&
                this.itemsAreColliding(item, this.items[i])) {
                collidingItems.push(i);
            }
        }
        return collidingItems;
    };
    GridList.prototype.itemsAreColliding = function (item1, item2) {
        var position1 = this.getItemPosition(item1), position2 = this.getItemPosition(item2);
        return !(position2.x >= position1.x + position1.w ||
            position2.x + position2.w <= position1.x ||
            position2.y >= position1.y + position1.h ||
            position2.y + position2.h <= position1.y);
    };
    /**
     * Attempt to resolve the collisions after moving a an item over one or more
     * other items within the grid, by shifting the position of the colliding
     * items around the moving one. This might result in subsequent collisions,
     * in which case we will revert all position permutations. To be able to
     * revert to the initial item positions, we create a virtual grid in the
     * process
     */
    GridList.prototype.tryToResolveCollisionsLocally = function (item) {
        var collidingItems = this.getItemsCollidingWithItem(item);
        if (!collidingItems.length) {
            return true;
        }
        var _gridList = new GridList([], this.options);
        var leftOfItem;
        var rightOfItem;
        var aboveOfItem;
        var belowOfItem;
        _gridList.items = this.items.map(function (itm) {
            return itm.copy();
        });
        _gridList.generateGrid();
        for (var i = 0; i < collidingItems.length; i++) {
            var collidingItem = _gridList.items[collidingItems[i]], collidingPosition = this.getItemPosition(collidingItem);
            // We use a simple algorithm for moving items around when collisions occur:
            // In this prioritized order, we try to move a colliding item around the
            // moving one:
            // 1. to its left side
            // 2. above it
            // 3. under it
            // 4. to its right side
            var position = this.getItemPosition(item);
            leftOfItem = [position.x - collidingPosition.w, collidingPosition.y];
            rightOfItem = [position.x + position.w, collidingPosition.y];
            aboveOfItem = [collidingPosition.x, position.y - collidingPosition.h];
            belowOfItem = [collidingPosition.x, position.y + position.h];
            if (_gridList.itemFitsAtPosition(collidingItem, leftOfItem)) {
                _gridList.updateItemPosition(collidingItem, leftOfItem);
            }
            else if (_gridList.itemFitsAtPosition(collidingItem, aboveOfItem)) {
                _gridList.updateItemPosition(collidingItem, aboveOfItem);
            }
            else if (_gridList.itemFitsAtPosition(collidingItem, belowOfItem)) {
                _gridList.updateItemPosition(collidingItem, belowOfItem);
            }
            else if (_gridList.itemFitsAtPosition(collidingItem, rightOfItem)) {
                _gridList.updateItemPosition(collidingItem, rightOfItem);
            }
            else {
                // Collisions failed, we must use the pullItemsToLeft method to arrange
                // the other items around this item with fixed position. This is our
                // plan B for when local collision resolving fails.
                return false;
            }
        }
        // If we reached this point it means we managed to resolve the collisions
        // from one single iteration, just by moving the colliding items around. So
        // we accept this scenario and marge the brached-out grid instance into the
        // original one
        this.items.forEach(function (itm, idx) {
            var cachedItem = _gridList.items.filter(function (cachedItm) {
                return cachedItm.$element === itm.$element;
            })[0];
            itm.x = cachedItem.x;
            itm.y = cachedItem.y;
            itm.w = cachedItem.w;
            itm.h = cachedItem.h;
            itm.autoSize = cachedItem.autoSize;
        });
        this.generateGrid();
        return true;
    };
    /**
     * When pulling items to the left, we need to find the leftmost position for
     * an item, with two considerations in mind:
     * - preserving its current row
     * - preserving the previous horizontal order between items
     */
    GridList.prototype.findLeftMostPositionForItem = function (item) {
        var tail = 0;
        var position = this.getItemPosition(item);
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = position.y; j < position.y + position.h; j++) {
                var otherItem = this.grid[i][j];
                if (!otherItem) {
                    continue;
                }
                var otherPosition = this.getItemPosition(otherItem);
                if (this.items.indexOf(otherItem) < this.items.indexOf(item)) {
                    tail = otherPosition.x + otherPosition.w;
                }
            }
        }
        return tail;
    };
    GridList.prototype.getItemByAttribute = function (key, value) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i][key] === value) {
                return this.items[i];
            }
        }
        return null;
    };
    GridList.prototype.padNumber = function (nr, prefix) {
        // Currently works for 2-digit numbers (<100)
        return nr >= 10 ? nr : prefix + nr;
    };
    /**
     * If the direction is vertical we need to rotate the grid 90 deg to the
     * left. Thus, we simulate the fact that items are being pulled to the top.
     *
     * Since the items have widths and heights, if we apply the classic
     * counter-clockwise 90 deg rotation
     *
     *     [0 -1]
     *     [1  0]
     *
     * then the top left point of an item will become the bottom left point of
     * the rotated item. To adjust for this, we need to subtract from the y
     * position the height of the original item - the width of the rotated item.
     *
     * However, if we do this then we'll reverse some actions: resizing the
     * width of an item will stretch the item to the left instead of to the
     * right; resizing an item that doesn't fit into the grid will push the
     * items around it instead of going on a new row, etc.
     *
     * We found it better to do a vertical flip of the grid after rotating it.
     * This restores the direction of the actions and greatly simplifies the
     * transformations.
     */
    GridList.prototype.getItemPosition = function (item) {
        if (this.options.direction === 'horizontal') {
            return item;
        }
        else {
            return {
                x: item.y,
                y: item.x,
                w: item.h,
                h: item.w
            };
        }
    };
    /**
     * See getItemPosition.
     */
    GridList.prototype.setItemPosition = function (item, position) {
        if (this.options.direction === 'horizontal') {
            item.x = position[0];
            item.y = position[1];
        }
        else {
            // We're supposed to subtract the rotated item's height which is actually
            // the non-rotated item's width.
            item.x = position[1];
            item.y = position[0];
        }
    };
    return GridList;
}());
//# sourceMappingURL=gridList.js.map

/***/ }),

/***/ 362:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridsterModule; });
var GridsterModule = (function () {
    function GridsterModule() {
    }
    return GridsterModule;
}());
//# sourceMappingURL=gridster.module.js.map

/***/ }),

/***/ 363:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DraggableEvent; });
var DraggableEvent = (function () {
    function DraggableEvent(event) {
        if (event.touches) {
            this.touchEvent = event;
            this.setDataFromTouchEvent(this.touchEvent);
        }
        else {
            this.mouseEvent = event;
            this.setDataFromMouseEvent(this.mouseEvent);
        }
    }
    DraggableEvent.prototype.isTouchEvent = function () {
        return !!this.touchEvent;
    };
    DraggableEvent.prototype.pauseEvent = function () {
        var event = this.touchEvent || this.mouseEvent;
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.cancelBubble = true;
        event.returnValue = false;
        return false;
    };
    DraggableEvent.prototype.getRelativeCoordinates = function (container) {
        var offset;
        var ref;
        offset = { left: 0, top: 0 };
        ref = container.offsetParent;
        offset.left = container.offsetLeft;
        offset.top = container.offsetTop;
        while (ref) {
            offset.left += ref.offsetLeft;
            offset.top += ref.offsetTop;
            ref = ref.offsetParent;
        }
        return {
            x: this.pageX - offset.left,
            y: this.pageY - offset.top,
        };
    };
    DraggableEvent.prototype.setDataFromMouseEvent = function (event) {
        this.target = event.target;
        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.pageX = event.pageX;
        this.pageY = event.pageY;
    };
    DraggableEvent.prototype.setDataFromTouchEvent = function (event) {
        this.target = event.target;
        this.clientX = event.touches[0].clientX;
        this.clientY = event.touches[0].clientY;
        this.pageX = event.touches[0].pageX;
        this.pageY = event.touches[0].pageY;
    };
    return DraggableEvent;
}());
//# sourceMappingURL=DraggableEvent.js.map

/***/ }),

/***/ 364:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_mergeMap__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_mergeMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_mergeMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_takeUntil__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_takeUntil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_takeUntil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_scan__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_scan___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_scan__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_filter__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_filter__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridsterPrototypeService; });








var GridsterPrototypeService = (function () {
    function GridsterPrototypeService() {
        this.isDragging = false;
        this.dragSubject = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this.dragStartSubject = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this.dragStopSubject = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    GridsterPrototypeService.prototype.observeDropOver = function (gridster) {
        var _this = this;
        return this.dragStopSubject.asObservable()
            .filter(function (item) {
            return _this.isInsideContainer(item.$element, gridster.$element);
        })
            .do(function (prototype) {
            // TODO: what we should provide as a param?
            // prototype.drop.emit({item: prototype.item});
            prototype.onDrop(gridster);
        });
    };
    GridsterPrototypeService.prototype.observeDropOut = function (gridster) {
        var _this = this;
        return this.dragStopSubject.asObservable()
            .filter(function (item) {
            return !_this.isInsideContainer(item.$element, gridster.$element);
        })
            .do(function (prototype) {
            // TODO: what we should provide as a param?
            prototype.onCancel();
        });
    };
    GridsterPrototypeService.prototype.observeDragOver = function (gridster) {
        var _this = this;
        var over = this.dragSubject.asObservable()
            .map(function (item) {
            return {
                item: item,
                isOver: _this.isInsideContainer(item.$element, gridster.$element),
                isDrop: false
            };
        });
        var drop = this.dragStopSubject.asObservable()
            .map(function (item) {
            return {
                item: item,
                isOver: _this.isInsideContainer(item.$element, gridster.$element),
                isDrop: true
            };
        });
        var dragExt = __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].merge(over, drop)
            .scan(function (prev, next) {
            return {
                item: next.item,
                isOver: next.isOver,
                isEnter: prev.isOver === false && next.isOver === true,
                isOut: prev.isOver === true && next.isOver === false && !prev.isDrop,
                isDrop: next.isDrop
            };
        })
            .filter(function (data) {
            return !data.isDrop;
        });
        var dragEnter = this.createDragEnterObservable(dragExt, gridster);
        var dragOut = this.createDragOutObservable(dragExt, gridster);
        var dragOver = dragEnter.switchMap(function () {
            return _this.dragSubject.asObservable()
                .takeUntil(dragOut);
        });
        return { dragEnter: dragEnter, dragOut: dragOut, dragOver: dragOver };
    };
    GridsterPrototypeService.prototype.dragItemStart = function (item) {
        this.isDragging = true;
        this.dragStartSubject.next(item);
    };
    GridsterPrototypeService.prototype.dragItemStop = function (item) {
        this.isDragging = false;
        this.dragStopSubject.next(item);
    };
    GridsterPrototypeService.prototype.updatePrototypePosition = function (item) {
        this.dragSubject.next(item);
    };
    /**
     * Creates observable that is fired on dragging over gridster container.
     * @param dragIsOver Observable that returns information true/false whether prototype item
     * is over gridster container
     * @returns {Observable}
     */
    GridsterPrototypeService.prototype.createDragOverObservable = function (dragIsOver, gridster) {
        return dragIsOver
            .filter(function (data) {
            return data.isOver && !data.isEnter && !data.isOut;
        })
            .map(function (data) {
            return data.item;
        })
            .do(function (item) {
            item.onOver(gridster);
        });
    };
    /**
     * Creates observable that is fired on drag enter gridster container.
     * @param dragIsOver Observable that returns information true/false whether prototype item
     * is over gridster container
     * @returns {Observable}
     */
    GridsterPrototypeService.prototype.createDragEnterObservable = function (dragIsOver, gridster) {
        return dragIsOver
            .filter(function (data) {
            return data.isEnter;
        })
            .map(function (data) {
            return data.item;
        })
            .do(function (item) {
            item.onEnter(gridster);
        });
    };
    /**
     * Creates observable that is fired on drag out gridster container.
     * @param dragIsOver Observable that returns information true/false whether prototype item
     * is over gridster container
     * @returns {Observable}
     */
    GridsterPrototypeService.prototype.createDragOutObservable = function (dragIsOver, gridster) {
        return dragIsOver
            .filter(function (data) {
            return data.isOut;
        })
            .map(function (data) {
            return data.item;
        })
            .do(function (item) {
            item.onOut(gridster);
        });
    };
    /**
     * Checks wheter "element" position fits inside "containerEl" position.
     * It checks if "element" is totally covered by "containerEl" area.
     * @param element Dragged element
     * @param containerEl Element above which "element" is dragged
     * @returns {boolean}
     */
    GridsterPrototypeService.prototype.isInsideContainer = function (element, containerEl) {
        var containerRect = containerEl.getBoundingClientRect();
        var elRect = element.getBoundingClientRect();
        return elRect.left > containerRect.left &&
            elRect.right < containerRect.right &&
            elRect.top > containerRect.top &&
            elRect.bottom < containerRect.bottom;
    };
    GridsterPrototypeService.ctorParameters = function () { return []; };
    return GridsterPrototypeService;
}());
//# sourceMappingURL=gridster-prototype.service.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_operator_filter__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_add_operator_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gridList_gridList__ = __webpack_require__(361);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridsterService; });


var GridsterService = (function () {
    function GridsterService() {
        this.items = [];
        this.disabledItems = [];
        this.draggableDefaults = {
            zIndex: 2,
            scroll: false,
            containment: 'parent'
        };
        this.defaults = {
            lanes: 5,
            direction: 'horizontal',
            itemSelector: 'li[data-w]',
            widthHeightRatio: 1,
            dragAndDrop: true,
            resizable: false,
            minWidth: 1,
            minHeight: 1,
            defaultItemWidth: 1,
            defaultItemHeight: 1
        };
    }
    /**
     * Must be called before init
     * @param item
     */
    GridsterService.prototype.registerItem = function (item) {
        this.items.push(item);
        return item;
    };
    GridsterService.prototype.init = function (options, draggableOptions, gridsterComponent) {
        if (options === void 0) { options = {}; }
        if (draggableOptions === void 0) { draggableOptions = {}; }
        this.gridsterComponent = gridsterComponent;
        this.options = Object.assign({}, this.defaults, options);
        this.draggableOptions = Object.assign({}, this.draggableDefaults, draggableOptions);
    };
    GridsterService.prototype.start = function (gridsterEl) {
        this.updateMaxItemSize();
        this.$element = gridsterEl;
        // Used to highlight a position an element will land on upon drop
        if (this.$positionHighlight) {
            this.$positionHighlight.style.display = 'none';
        }
        this.initGridList();
        this.reflow();
        this.enableDisabledItems();
    };
    GridsterService.prototype.render = function () {
        this.updateMaxItemSize();
        this.gridList.generateGrid();
        this.applySizeToItems();
        this.applyPositionToItems();
    };
    GridsterService.prototype.reflow = function () {
        this.calculateCellSize();
        this.render();
    };
    GridsterService.prototype.enableDisabledItems = function () {
        while (this.disabledItems.length) {
            var item = this.disabledItems.shift();
            var position = this.findDefaultPosition(item.w, item.h);
            item.x = position[0];
            item.y = position[1];
            item.itemComponent.enableItem();
        }
    };
    GridsterService.prototype.copyItems = function () {
        return this.items.map(function (item) {
            return item.copy();
        });
    };
    GridsterService.prototype.onResizeStart = function (item) {
        this.currentElement = item.$element;
        this._items = this.copyItems();
        this._maxGridCols = this.gridList.grid.length;
        this.highlightPositionForItem(item);
        this.gridsterComponent.isResizing = true;
    };
    GridsterService.prototype.onResizeDrag = function (item) {
        var newSize = this.snapItemSizeToGrid(item);
        var sizeChanged = this.dragSizeChanged(newSize);
        var newPosition = this.snapItemPositionToGrid(item);
        var positionChanged = this.dragPositionChanged(newPosition);
        if (sizeChanged || positionChanged) {
            // Regenerate the grid with the positions from when the drag started
            this.restoreCachedItems();
            this.gridList.generateGrid();
            this.previousDragPosition = newPosition;
            this.previousDragSize = newSize;
            this.gridList.moveAndResize(item, newPosition, { w: newSize[0], h: newSize[1] });
            // Visually update item positions and highlight shape
            this.applyPositionToItems();
            this.highlightPositionForItem(item);
        }
    };
    GridsterService.prototype.onResizeStop = function (item) {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragSize = null;
        this.removePositionHighlight();
        this.gridList.pullItemsToLeft();
        this.render();
        this.gridsterComponent.isResizing = false;
        this.gridsterComponent.resize.emit(item);
    };
    GridsterService.prototype.onStart = function (item) {
        this.currentElement = item.$element;
        // itemCtrl.isDragging = true;
        // Create a deep copy of the items; we use them to revert the item
        // positions after each drag change, making an entire drag operation less
        // distructable
        this._items = this.copyItems();
        // Since dragging actually alters the grid, we need to establish the number
        // of cols (+1 extra) before the drag starts
        this._maxGridCols = this.gridList.grid.length;
        this.highlightPositionForItem(item);
        this.gridsterComponent.isDragging = true;
    };
    GridsterService.prototype.onDrag = function (item) {
        var newPosition = this.snapItemPositionToGrid(item);
        if (this.dragPositionChanged(newPosition)) {
            this.previousDragPosition = newPosition;
            // Regenerate the grid with the positions from when the drag started
            this.restoreCachedItems();
            this.gridList.generateGrid();
            // Since the items list is a deep copy, we need to fetch the item
            // corresponding to this drag action again
            this.gridList.moveItemToPosition(item, newPosition);
            // Visually update item positions and highlight shape
            this.applyPositionToItems();
            this.highlightPositionForItem(item);
        }
    };
    GridsterService.prototype.onDragOut = function (item) {
        this.previousDragPosition = null;
        this.updateMaxItemSize();
        this.applyPositionToItems();
        this.removePositionHighlight();
        this.currentElement = undefined;
        var idx = this.items.indexOf(item);
        this.items.splice(idx, 1);
        this.gridList.pullItemsToLeft();
        this.render();
    };
    GridsterService.prototype.onStop = function (item) {
        this.currentElement = undefined;
        this.updateCachedItems();
        this.previousDragPosition = null;
        // itemCtrl.isDragging = false;
        this.removePositionHighlight();
        this.gridList.pullItemsToLeft();
        this.render();
        this.gridsterComponent.isDragging = false;
    };
    GridsterService.prototype.getItemWidth = function (item) {
        return item.w * this.cellWidth;
    };
    GridsterService.prototype.getItemHeight = function (item) {
        return item.h * this.cellHeight;
    };
    GridsterService.prototype.offset = function (el, relativeEl) {
        var elRect = el.getBoundingClientRect();
        var relativeElRect = relativeEl.getBoundingClientRect();
        return {
            left: elRect.left - relativeElRect.left,
            top: elRect.top - relativeElRect.top,
            right: relativeElRect.right - elRect.right,
            bottom: relativeElRect.bottom - elRect.bottom
        };
    };
    GridsterService.prototype.findDefaultPosition = function (width, height) {
        if (this.options.direction === 'horizontal') {
            return this.findDefaultPositionHorizontal(width, height);
        }
        return this.findDefaultPositionVertical(width, height);
    };
    GridsterService.prototype.findDefaultPositionHorizontal = function (width, height) {
        for (var _i = 0, _a = this.gridList.grid; _i < _a.length; _i++) {
            var col = _a[_i];
            var colIdx = this.gridList.grid.indexOf(col);
            var rowIdx = 0;
            while (rowIdx < (col.length - height + 1)) {
                if (!this.checkItemsInArea(colIdx, colIdx + width - 1, rowIdx, rowIdx + height - 1)) {
                    return [colIdx, rowIdx];
                }
                rowIdx++;
            }
        }
        return [this.gridList.grid.length, 0];
    };
    GridsterService.prototype.findDefaultPositionVertical = function (width, height) {
        for (var _i = 0, _a = this.gridList.grid; _i < _a.length; _i++) {
            var row = _a[_i];
            var rowIdx = this.gridList.grid.indexOf(row);
            var colIdx = 0;
            while (colIdx < (row.length - width + 1)) {
                if (!this.checkItemsInArea(rowIdx, rowIdx + height - 1, colIdx, colIdx + width - 1)) {
                    return [colIdx, rowIdx];
                }
                colIdx++;
            }
        }
        return [0, this.gridList.grid.length];
    };
    GridsterService.prototype.checkItemsInArea = function (rowStart, rowEnd, colStart, colEnd) {
        for (var i = rowStart; i <= rowEnd; i++) {
            for (var j = colStart; j <= colEnd; j++) {
                if (this.gridList.grid[i] && this.gridList.grid[i][j]) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Update maxItemWidth and maxItemHeight vales according to current state of items
     */
    GridsterService.prototype.updateMaxItemSize = function () {
        this.maxItemWidth = Math.max.apply(null, this.items.map(function (item) { return item.w; }));
        this.maxItemHeight = Math.max.apply(null, this.items.map(function (item) { return item.h; }));
    };
    /**
     * Update items properties of previously cached items
     */
    GridsterService.prototype.restoreCachedItems = function () {
        var _this = this;
        this.items.forEach(function (item) {
            var cachedItem = _this._items.filter(function (cachedItm) {
                return cachedItm.$element === item.$element;
            })[0];
            item.x = cachedItem.x;
            item.y = cachedItem.y;
            item.w = cachedItem.w;
            item.h = cachedItem.h;
            item.autoSize = cachedItem.autoSize;
        });
    };
    GridsterService.prototype.initGridList = function () {
        // Create instance of GridList (decoupled lib for handling the grid
        // positioning and sorting post-drag and dropping)
        this.gridList = new __WEBPACK_IMPORTED_MODULE_1__gridList_gridList__["a" /* GridList */](this.items, {
            lanes: this.options.lanes,
            direction: this.options.direction
        });
    };
    GridsterService.prototype.calculateCellSize = function () {
        if (this.options.direction === 'horizontal') {
            // TODO: get rid of window.getComputedStyle
            this.cellHeight = Math.floor(parseFloat(window.getComputedStyle(this.$element).height) / this.options.lanes);
            this.cellWidth = this.cellHeight * this.options.widthHeightRatio;
        }
        else {
            // TODO: get rid of window.getComputedStyle
            this.cellWidth = Math.floor(parseFloat(window.getComputedStyle(this.$element).width) / this.options.lanes);
            this.cellHeight = this.cellWidth / this.options.widthHeightRatio;
        }
        if (this.options.heightToFontSizeRatio) {
            this._fontSize = this.cellHeight * this.options.heightToFontSizeRatio;
        }
    };
    GridsterService.prototype.applySizeToItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].$element.style.width = this.getItemWidth(this.items[i]) + 'px';
            this.items[i].$element.style.height = this.getItemHeight(this.items[i]) + 'px';
            if (this.options.heightToFontSizeRatio) {
                this.items[i].$element.style['font-size'] = this._fontSize;
            }
        }
    };
    GridsterService.prototype.applyPositionToItems = function () {
        // TODO: Implement group separators
        for (var i = 0; i < this.items.length; i++) {
            // Don't interfere with the positions of the dragged items
            if (this.isCurrentElement(this.items[i].$element)) {
                continue;
            }
            this.items[i].$element.style.left = (this.items[i].x * this.cellWidth) + 'px';
            this.items[i].$element.style.top = (this.items[i].y * this.cellHeight) + 'px';
        }
        var child = this.$element.firstChild;
        // Update the width of the entire grid container with enough room on the
        // right to allow dragging items to the end of the grid.
        if (this.options.direction === 'horizontal') {
            child.style.height = (this.options.lanes * this.cellHeight) + 'px';
            child.style.width = ((this.gridList.grid.length + this.maxItemWidth) * this.cellWidth) + 'px';
        }
        else {
            child.style.height = ((this.gridList.grid.length + this.maxItemHeight) * this.cellHeight) + 'px';
            child.style.width = (this.options.lanes * this.cellWidth) + 'px';
        }
    };
    GridsterService.prototype.isCurrentElement = function (element) {
        if (!this.currentElement) {
            return false;
        }
        return element === this.currentElement;
    };
    GridsterService.prototype.snapItemSizeToGrid = function (item) {
        var itemSize = {
            width: parseInt(item.$element.style.width, 10) - 1,
            height: parseInt(item.$element.style.height, 10) - 1
        };
        var colSize = Math.round(itemSize.width / this.cellWidth);
        var rowSize = Math.round(itemSize.height / this.cellHeight);
        // Keep item minimum 1
        colSize = Math.max(colSize, 1);
        rowSize = Math.max(rowSize, 1);
        return [colSize, rowSize];
    };
    GridsterService.prototype.snapItemPositionToGrid = function (item) {
        var position = this.offset(item.$element, this.$element);
        var col = Math.round(position.left / this.cellWidth), row = Math.round(position.top / this.cellHeight);
        // Keep item position within the grid and don't let the item create more
        // than one extra column
        col = Math.max(col, 0);
        row = Math.max(row, 0);
        if (this.options.direction === 'horizontal') {
            col = Math.min(col, this._maxGridCols);
            row = Math.min(row, this.options.lanes - item.h);
        }
        else {
            col = Math.min(col, this.options.lanes - item.w);
            row = Math.min(row, this._maxGridCols);
        }
        return [col, row];
    };
    GridsterService.prototype.dragSizeChanged = function (newSize) {
        if (!this.previousDragSize) {
            return true;
        }
        return (newSize[0] !== this.previousDragSize[0] ||
            newSize[1] !== this.previousDragSize[1]);
    };
    GridsterService.prototype.dragPositionChanged = function (newPosition) {
        if (!this.previousDragPosition) {
            return true;
        }
        return (newPosition[0] !== this.previousDragPosition[0] ||
            newPosition[1] !== this.previousDragPosition[1]);
    };
    GridsterService.prototype.highlightPositionForItem = function (item) {
        this.$positionHighlight.style.width = this.getItemWidth(item) + 'px';
        this.$positionHighlight.style.height = this.getItemHeight(item) + 'px';
        this.$positionHighlight.style.left = item.x * this.cellWidth + 'px';
        this.$positionHighlight.style.top = item.y * this.cellHeight + 'px';
        this.$positionHighlight.style.display = '';
        if (this.options.heightToFontSizeRatio) {
            this.$positionHighlight.style['font-size'] = this._fontSize;
        }
    };
    GridsterService.prototype.updateCachedItems = function () {
        // Notify the user with the items that changed since the previous snapshot
        this.triggerOnChange();
        this._items = this.copyItems();
    };
    GridsterService.prototype.triggerOnChange = function () {
        var itemsChanged = this.gridList.getChangedItems(this._items, '$element');
        var changeMap = this.gridList.getChangedItemsMap(this._items);
        changeMap.x
            .filter(function (item) {
            return item.itemComponent;
        })
            .forEach(function (item) {
            item.itemComponent.xChange.emit(item.x);
        });
        changeMap.y
            .filter(function (item) {
            return item.itemComponent;
        })
            .forEach(function (item) {
            item.itemComponent.yChange.emit(item.y);
        });
        changeMap.w
            .filter(function (item) {
            return item.itemComponent;
        })
            .forEach(function (item) {
            item.itemComponent.wChange.emit(item.w);
        });
        changeMap.h
            .filter(function (item) {
            return item.itemComponent;
        })
            .forEach(function (item) {
            item.itemComponent.hChange.emit(item.h);
        });
        if (itemsChanged.length > 0) {
            this.gridsterChange.emit(itemsChanged);
        }
    };
    GridsterService.prototype.removePositionHighlight = function () {
        this.$positionHighlight.style.display = 'none';
    };
    GridsterService.ctorParameters = function () { return []; };
    return GridsterService;
}());
//# sourceMappingURL=gridster.service.js.map

/***/ }),

/***/ 686:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(282);


/***/ })

},[686]);
//# sourceMappingURL=main.bundle.js.map