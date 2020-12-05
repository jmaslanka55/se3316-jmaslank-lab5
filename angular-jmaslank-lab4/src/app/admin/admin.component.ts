import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users = [];

  constructor(private service: HttpService) {
  }

  ngOnInit(): void {
  }

  getUsers(auth: string) {
    return this.service.get(`api/populate/user/${auth}`);
  }

  callUsers() {
    let authObject = {headers: {Authorization: "Bearer " + localStorage.getItem("jwt")}};
    this.getUsers(JSON.stringify(authObject)).subscribe((res: any) => {
      this.users = res;
    });
  }

  giveAdmin(user: string, auth: string) {
    return this.service.post(`api/change/admin/${user}/${auth}`, {}, {responseType: 'text'})
  }

  callAdmin(user) {
    let authObject = {headers: {Authorization: "Bearer " + localStorage.getItem("jwt")}};
    this.giveAdmin(user, JSON.stringify(authObject)).subscribe((res: any) => {
    })
  }

  deactivateUser(user: string, auth: string) {
    return this.service.post(`api/deactivated/${user}/${auth}`, {}, {responseType: 'text'})
  }

  callDeactivate(user) {
    let authObject = {headers: {Authorization: "Bearer " + localStorage.getItem("jwt")}};
    this.deactivateUser(user, JSON.stringify(authObject)).subscribe((res: any) => {
    })
  }
  activateUser(user: string, auth: string) {
    return this.service.post(`api/activate/${user}/${auth}`, {}, {responseType: 'text'})
  }

  callActivate(user) {
    let authObject = {headers: {Authorization: "Bearer " + localStorage.getItem("jwt")}};
    this.activateUser(user, JSON.stringify(authObject)).subscribe((res: any) => {
    })
  }
}
