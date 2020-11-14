import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ListComponent} from "./list/list.component";

const routes: Routes = [
  {path: 'Schedule', component: HomeComponent},
  {path: 'Course', component: ListComponent},
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
