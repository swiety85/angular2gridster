import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridsterModule } from './gridster/gridster.module';
import { UiSwitchModule } from 'ngx-ui-switch/src'

import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { WidgetComponent } from './widget/widget.component';
import { GridsterConfiguratorComponent } from './gridster-configurator/gridster-configurator.component';
import { DynamicComponentDirective } from './dynamic-component.directive';


import { MdCheckboxModule } from '@angular/material';
import { MdSidenavModule } from '@angular/material';
import { MdSliderModule } from '@angular/material';
import { MdRadioModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdIconModule } from '@angular/material';

@NgModule({
    declarations: [
        AppComponent,
        TestComponent,
        WidgetComponent,
        GridsterConfiguratorComponent,
        DynamicComponentDirective
    ],
    entryComponents: [ TestComponent, GridsterConfiguratorComponent ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        GridsterModule,
        BrowserAnimationsModule,
        UiSwitchModule,

        MdCheckboxModule,
        MdSidenavModule,
        MdSliderModule,
        MdRadioModule,
        MdButtonModule,
        MdIconModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
