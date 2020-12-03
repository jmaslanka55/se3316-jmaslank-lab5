import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = "";
  password = "";
  constructor(private service: HttpService) { }

  ngOnInit(): void {
  }
  verify(){
    this.postLog({emailaddress: this.email, passcode: this.password}).subscribe((res:any)=>{
      console.log(res);
      let temp = JSON.parse(res);
      localStorage.setItem("jwt", temp.accessToken);
      console.log("Logged in");
    });
  }
  postLog(info: object){
    return this.service.post('api/login',info,{responseType: 'text'})
  }

}


