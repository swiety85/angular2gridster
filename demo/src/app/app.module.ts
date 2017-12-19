import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { GridsterModule } from './gridster/gridster.module';
import { StoreModule } from '@ngrx/store';
import { widgetsReducer } from './widgets';


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
        StoreModule.provideStore({ widgets: widgetsReducer })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
