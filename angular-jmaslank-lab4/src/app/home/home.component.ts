import { Component, OnInit } from '@angular/core';
import {HttpService} from "../http.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  schedName;
  constructor(private service: HttpService) { }

  ngOnInit(): void {
  }
  makeSchedule(){
    this.service.put(`api/schedule/${this.schedName}`, schedule);
  }
  createSchedule(){

  }

}
