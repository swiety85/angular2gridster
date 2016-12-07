"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var gridster_component_1 = require('./gridster.component');
var gridster_item_component_1 = require('./gridster-item/gridster-item.component');
var GridsterModule = (function () {
    function GridsterModule() {
    }
    GridsterModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        gridster_component_1.GridsterComponent,
                        gridster_item_component_1.GridsterItemComponent
                    ],
                    exports: [
                        gridster_component_1.GridsterComponent,
                        gridster_item_component_1.GridsterItemComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    GridsterModule.ctorParameters = [];
    return GridsterModule;
}());
exports.GridsterModule = GridsterModule;
//# sourceMappingURL=gridster.module.js.map