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
      let temp = JSON.parse(res);
      localStorage.setItem("jwt", temp.accessToken);
      if (temp.message == "success") {
        document.getElementById("loginStatus").textContent = "Successfully logged in";
      } else if(temp.message == "deactivated"){
        document.getElementById("loginStatus").textContent = "Account deactivated contact admin";
      }
      else{
        document.getElementById("loginStatus").textContent = "Username/Password Incorrect";
      }
    });
  }
  postLog(info: object){
    return this.service.post('api/login',info,{responseType: 'text'})
  }

}


