import {Component, OnInit} from '@angular/core';
import {HttpService} from "../http.service";
import {HttpHeaders} from "@angular/common/http";
import {stringify} from "querystring";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  schedName;
  subjectName;
  courseCode;
  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  readonly schedule = {};


  constructor(private service: HttpService) {
  }

  ngOnInit(): void {
  }

  makeSchedule() {
    return this.service.put(`api/schedule/${this.schedName}`, this.schedule, {responseType: 'text'});
  }

  createSchedule() {
    this.makeSchedule().subscribe((res: any) => {
      console.log(res);
    })
  }

  addToSchedule() {
    return this.service.put(`api/make/schedule/${this.schedName}`,{"subject":this.subjectName, "catalog_nbr": this.courseCode} , {responseType: 'text'});
  }

  addingSchedule() {
    this.addToSchedule().subscribe((res: any) => {
      console.log(res);
    })
  }

  removeSchedule() {
    return this.service.post(`api/remove/schedule/${this.schedName}`,this.schedule, {resonseType: 'text'});
  }

  deleteSchedule() {
    this.removeSchedule().subscribe((res:any)=>{
      console.log(res);
    })
  }

  deleteAllSchedules() {

  }

  listSchedules() {
    return this.service.get(`api/show/schedule`);
  }

  listAllSchedules() {
    this.listSchedules().subscribe((res: any) => {
      document.getElementById("ShowResults").textContent = JSON.stringify(res);
    })
  }


}
