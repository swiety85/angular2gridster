import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsterComponent } from './gridster.component';
import { GridsterItemComponent } from './gridster-item/gridster-item.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GridsterComponent,
    GridsterItemComponent
  ],
  exports: [
    GridsterComponent,
    GridsterItemComponent
  ]
})
export class GridsterModule { }

