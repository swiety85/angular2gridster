"use strict";
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
require('rxjs/Rx');
var gridster_service_1 = require('../gridster.service');
var GridsterItemComponent = (function () {
    function GridsterItemComponent(elementRef, gridster) {
        this.gridster = gridster;
        this.el = elementRef.nativeElement;
    }
    GridsterItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gridster.registerItem({
            $element: this.el,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        });
        if (this.gridster.options.dragAndDrop) {
            this.createMouseDrag(this.el);
            this.createTouchDrag(this.el);
            // Update position
            this.dragSubscription = this.dragging.subscribe(function (pos) {
                _this.el.style.top = (pos.top - _this.gridster.$element.offsetTop) + 'px';
                _this.el.style.left = (pos.left - _this.gridster.$element.offsetLeft) + 'px';
            });
        }
    };
    /**
     * Checks if between target and container exists element with given class
     * @param target
     * @param container
     * @returns {boolean}
     */
    GridsterItemComponent.prototype.hasElementWithClass = function (className, target, container) {
        while (target !== container) {
            if (target.classList
                .contains(this.gridster.draggableOptions.handlerClass)) {
                return true;
            }
            target = target.parentElement;
        }
        return false;
    };
    /**
     * Create and subscribe to drag event.
     * @param {HTMLElement} dragTarget
     */
    GridsterItemComponent.prototype.createMouseDrag = function (dragTarget) {
        var _this = this;
        // Get the three major events
        var mouseup = Observable_1.Observable.fromEvent(dragTarget, 'mouseup'), mousemove = Observable_1.Observable.fromEvent(document, 'mousemove'), mousedown = Observable_1.Observable.fromEvent(dragTarget, 'mousedown');
        this.dragging = mousedown.flatMap(function (md) {
            var drag, coordinates = _this.getRelativeCoordinates({ pageX: md.pageX, pageY: md.pageY }, dragTarget), startX = coordinates.x, startY = coordinates.y, hasHandler = _this.hasElementWithClass(_this.gridster.draggableOptions.handlerClass, md.target, dragTarget), containerCoordincates = _this.gridster.$element.getBoundingClientRect();
            if (_this.gridster.draggableOptions.handlerClass && !hasHandler) {
                return Observable_1.Observable.of(false);
            }
            _this.gridster.onStart(_this);
            _this.el.classList.add('is-dragging');
            // Calculate delta with mousemove until mouseup
            drag = mousemove.map(function (mm) {
                mm.preventDefault();
                _this.gridster.onDrag(_this);
                return {
                    left: mm.clientX - containerCoordincates.left - startX,
                    top: mm.clientY - containerCoordincates.top - startY
                };
            }).takeUntil(mouseup);
            drag.subscribe(null, null, function () {
                _this.gridster.onStop(_this);
                _this.el.classList.remove('is-dragging');
            });
            return drag;
        });
    };
    GridsterItemComponent.prototype.createTouchDrag = function (dragTarget) {
        var _this = this;
        // Get the three major events
        var touchstart = Observable_1.Observable.fromEvent(dragTarget, 'touchstart'), touchmove = Observable_1.Observable.fromEvent(document, 'touchmove'), touchend = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(dragTarget, 'touchend'), Observable_1.Observable.fromEvent(dragTarget, 'touchcancel')), touchhold = touchstart.flatMap(function (e) {
            e.preventDefault();
            return Observable_1.Observable
                .of(e)
                .delay(500) // hold press delay
                .map(function (data) {
                return data;
            })
                .takeUntil(Observable_1.Observable.merge(touchend, touchmove));
        });
        this.dragging = Observable_1.Observable.merge(this.dragging, touchstart.flatMap(function (td) {
            var drag, touchData = td.touches[0], coordinates = _this.getRelativeCoordinates({ pageX: touchData.pageX, pageY: touchData.pageY }, dragTarget), startX = coordinates.x, startY = coordinates.y, hasHandler = _this.hasElementWithClass(_this.gridster.draggableOptions.handlerClass, td.target, dragTarget), containerCoordincates = _this.gridster.$element.getBoundingClientRect();
            if (_this.gridster.draggableOptions.handlerClass && !hasHandler) {
                return Observable_1.Observable.of(false);
            }
            _this.gridster.onStart(_this);
            _this.el.classList.add('is-dragging');
            // Calculate delta with mousemove until mouseup
            drag = touchmove.map(function (tm) {
                var touchMoveData = tm.touches[0];
                tm.preventDefault();
                _this.gridster.onDrag(_this);
                return {
                    left: touchMoveData.clientX - containerCoordincates.left - startX,
                    top: touchMoveData.clientY - containerCoordincates.top - startY
                };
            }).takeUntil(touchend);
            drag.subscribe(null, null, function () {
                _this.gridster.onStop(_this);
                _this.el.classList.remove('is-dragging');
            });
            return drag;
        }));
    };
    /**
     * Get coordinates of cursor relative to given container
     * @param {{pageX,pageY}} e
     * @param {HtmlElement} container
     * @return {{x: number, y: number}}
     */
    GridsterItemComponent.prototype.getRelativeCoordinates = function (e, container) {
        var offset, ref;
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
            x: e.pageX - offset.left,
            y: e.pageY - offset.top,
        };
    };
    GridsterItemComponent.prototype.ngOnDestroy = function () {
        this.dragSubscription.unsubscribe();
    };
    GridsterItemComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'gridster-item',
                    templateUrl: './gridster-item.component.html',
                    styleUrls: ['./gridster-item.component.css']
                },] },
    ];
    /** @nocollapse */
    GridsterItemComponent.ctorParameters = [
        { type: core_1.ElementRef, decorators: [{ type: core_1.Inject, args: [core_1.ElementRef,] },] },
        { type: gridster_service_1.GridsterService, decorators: [{ type: core_1.Host },] },
    ];
    GridsterItemComponent.propDecorators = {
        'x': [{ type: core_1.Input, args: ['x',] },],
        'y': [{ type: core_1.Input, args: ['y',] },],
        'w': [{ type: core_1.Input, args: ['w',] },],
        'h': [{ type: core_1.Input, args: ['h',] },],
    };
    return GridsterItemComponent;
}());
exports.GridsterItemComponent = GridsterItemComponent;
//# sourceMappingURL=gridster-item.component.js.map