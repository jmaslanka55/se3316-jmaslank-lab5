import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from "@angular/common/http";
import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule, AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
