import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GridsterModule } from './gridster/gridster.module';
import { MdSidenavModule, MdButtonModule } from '@angular/material';

import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';

@NgModule({
    declarations: [
        AppComponent,
        TestComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        GridsterModule,
        NoopAnimationsModule,
        MdSidenavModule,
        MdButtonModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
