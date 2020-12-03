import { Component, OnInit } from '@angular/core';
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

  constructor(private service: HttpService) { }

  ngOnInit(): void {
  }

}
