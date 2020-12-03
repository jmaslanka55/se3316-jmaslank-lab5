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
      LocalStorage.setItem("jwt", temp.accessToken)
      console.log(temp)

      if (temp.message =="success"){
        let next = document.getElementById("hideMe");
        next.removeAttribute("hidden");
      }
    });
  }
  postLog(info: object){
    return this.service.post('api/login',info,{responseType: 'text'})
  }

}


