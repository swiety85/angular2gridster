"use strict";
var core_1 = require('@angular/core');
var gridster_service_1 = require('./gridster.service');
var GridsterComponent = (function () {
    function GridsterComponent(elementRef, gridster) {
        this.gridster = gridster;
        this.$el = elementRef.nativeElement;
    }
    GridsterComponent.prototype.ngOnInit = function () {
        this.gridster.init(this.options, {});
    };
    GridsterComponent.prototype.ngAfterViewInit = function () {
        this.gridster.start(this.$el);
        this.gridster.$positionHighlight = this.$positionHighlight.nativeElement;
    };
    GridsterComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'gridster',
                    templateUrl: './gridster.component.html',
                    styleUrls: ['./gridster.component.css'],
                    providers: [
                        gridster_service_1.GridsterService
                    ]
                },] },
    ];
    /** @nocollapse */
    GridsterComponent.ctorParameters = [
        { type: core_1.ElementRef, decorators: [{ type: core_1.Inject, args: [core_1.ElementRef,] },] },
        { type: gridster_service_1.GridsterService, },
    ];
    GridsterComponent.propDecorators = {
        'options': [{ type: core_1.Input, args: ['options',] },],
        '$positionHighlight': [{ type: core_1.ViewChild, args: ['positionHighlight',] },],
    };
    return GridsterComponent;
}());
exports.GridsterComponent = GridsterComponent;
//# sourceMappingURL=gridster.component.js.map