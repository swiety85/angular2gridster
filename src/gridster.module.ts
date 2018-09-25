import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsterComponent } from './gridster.component';
import { GridsterItemComponent } from './gridster-item/gridster-item.component';
import { GridsterItemPrototypeDirective } from './gridster-prototype/gridster-item-prototype.directive';
import { GridsterPrototypeService } from './gridster-prototype/gridster-prototype.service';

@NgModule({
    imports: [CommonModule],
    declarations: [
        GridsterComponent,
        GridsterItemComponent,
        GridsterItemPrototypeDirective
    ],
    exports: [
        GridsterComponent,
        GridsterItemComponent,
        GridsterItemPrototypeDirective
    ]
})
export class GridsterModule {
    static forRoot() {
        return {
            ngModule: GridsterModule,
            providers: [GridsterPrototypeService]
        };
    }
}
