import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OutsideElementClickDirective} from "./outside-element-click.directive";

@NgModule ({
    imports: [
        CommonModule
    ],
    exports: [
        OutsideElementClickDirective
    ],
    declarations: [
        OutsideElementClickDirective
    ]
})
export class SharedModule {
}
