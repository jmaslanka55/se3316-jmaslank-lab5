import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ListComponent} from "./list/list.component";
import {CreateUserComponent} from "./create-user/create-user.component";
import {LoginComponent} from "./login/login.component";
import {AdminComponent} from "./admin/admin.component";

const routes: Routes = [
  {path: '',component: LoginComponent},
  {path: 'Schedule', component: HomeComponent},
  {path: 'Course', component: ListComponent},
  {path: 'Create', component: CreateUserComponent},
  {path: 'Admin', component:AdminComponent}
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
