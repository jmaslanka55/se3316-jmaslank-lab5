import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {HomeComponent} from './home/home.component';
import {ListComponent} from './list/list.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateUserComponent} from './create-user/create-user.component';
import {LoginComponent} from './login/login.component';
import { AdminComponent } from './admin/admin.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent,
    CreateUserComponent,
    LoginComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule, AppRoutingModule, FormsModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
