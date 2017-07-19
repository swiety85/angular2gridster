import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridsterModule } from './gridster/gridster.module';

import { AppComponent } from './app.component';
import { DynamicComponentDirective } from './dynamic-component.directive';
import { GridsterConfiguratorComponent } from './gridster-configurator/gridster-configurator.component';
import { SharedModule } from "./shared/shared.module";
import { WidgetsModule } from './widgets/widgets.module';

import { TestComponent } from './test/test.component';

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
        GridsterConfiguratorComponent,
        DynamicComponentDirective
    ],
    imports: [
        GridsterModule,
        SharedModule,
        WidgetsModule,

        BrowserModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule,

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
