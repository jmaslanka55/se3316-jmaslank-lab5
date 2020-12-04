import {Component, OnInit} from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  firstName = "";
  lastName = "";
  email = "";
  password = "";
  emailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  constructor(private service: HttpService) {
  }

  ngOnInit(): void {
  }

  createUser() {
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
    this.postUser({
      name: this.firstName + " " + this.lastName,
      email: this.email,
      finalPassword: this.password
    }).subscribe((res: any) => {
      console.log(JSON.parse(res));
      let temp = JSON.parse(res);
      if (temp.message == "Email already registered") {
        alert("email already registered");
      } else if (temp.message = "Account created") {
        alert("account created");
      }
    });
  }

  postUser(values: object) {
    return this.service.put('api/users', values, {responseType: 'text'})
  }
}
