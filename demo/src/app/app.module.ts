import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NglModule } from 'ng-lightning/ng-lightning';
import { GridsterModule } from './gridster/gridster.module';

import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { WidgetComponent } from './widget/widget.component';

@NgModule({
    declarations: [
        AppComponent,
        TestComponent,
        WidgetComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        GridsterModule,
        NoopAnimationsModule,
        NglModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
