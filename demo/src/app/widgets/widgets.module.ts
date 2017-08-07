import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import {UiSwitchModule} from 'ngx-ui-switch/src'

import {WidgetPanelComponent} from './widget-panel/widget-panel.component';
import {WidgetBarComponent} from './widget-bar/widget-bar.component';
import {ChartWidgetComponent} from './chart-widget/chart-widget.component';
import {GridsterModule} from '../gridster/gridster.module';
import {MdIconModule} from '@angular/material';
import {TextWidgetComponent} from './text-widget/text-widget.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    declarations: [
        WidgetPanelComponent,
        WidgetBarComponent,
        ChartWidgetComponent,
        TextWidgetComponent
    ],
    entryComponents: [
        ChartWidgetComponent,
        TextWidgetComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ChartsModule,
        UiSwitchModule,
        GridsterModule,
        SharedModule,

        MdIconModule
    ],
    exports: [
        WidgetPanelComponent,
        WidgetBarComponent
    ]
})
export class WidgetsModule {
}
