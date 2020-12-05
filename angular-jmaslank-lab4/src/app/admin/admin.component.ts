import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users = [];
  constructor(private service: HttpService) { }

  ngOnInit(): void {
  }
  getUsers(auth:string){
    return this.service.get(`api/populate/user/${auth}`);
  }

  callUsers(){
    let authObject = {headers: {Authorization : "Bearer " + localStorage.getItem("jwt")}};
    this.getUsers(JSON.stringify(authObject)).subscribe((res: any) =>{
      this.users = res;
    });
  }
}
