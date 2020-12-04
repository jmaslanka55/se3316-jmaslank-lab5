import {Component, OnInit} from '@angular/core';
import {HttpService} from "../http.service";
import {Router, RouterModule} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = "";
  password = "";
  emailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  name = "";

  constructor(private service: HttpService, private router: Router) {
  }

  ngOnInit(): void {
  }

  verify() {
    if (this.email == "") {
      alert("Please enter email");
      return;
    } else if (this.password == "") {
      alert("Please enter password");
      return;
    }
    if (!(this.email.match(this.emailformat))) {
      alert("invalid Email");
      return;
    }
    this.getName().subscribe((res:any)=>{
      this.name = res;
      console.log(res)
    });
    this.postLog({emailaddress: this.email, passcode: this.password, name: this.name}).subscribe((res: any) => {
      let temp = JSON.parse(res);
      localStorage.setItem("jwt", temp.accessToken);
      if (temp.message == "success") {
        document.getElementById("loginStatus").textContent = "Successfully logged in";
        this.router.navigate(['Schedule']);
      } else if (temp.message == "deactivated") {
        document.getElementById("loginStatus").textContent = "Account deactivated contact admin";
      } else {
        document.getElementById("loginStatus").textContent = "Username/Password Incorrect";
      }
    });
  }

  postLog(info: object) {
    return this.service.post('api/login', info, {responseType: 'text'})
  }
  getName(){
    return this.service.get(`api/username/${this.email}`);
  }

}


