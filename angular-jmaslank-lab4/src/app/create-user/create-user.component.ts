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

  constructor(private service: HttpService) {
  }

  ngOnInit(): void {
  }

  createUser() {
    this.postUser({name: this.firstName + " " + this.lastName, email:this.email, finalPassword:this.password}).subscribe((res: any)=>{

    });
  }
  postUser(values:object){
    return this.service.put('api/users',values, {responseType:'text'})
  }
}
