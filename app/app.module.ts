import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { GridsterModule } from '../..';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GridsterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
