import {Component, OnInit} from '@angular/core';
import {HttpService} from "../http.service";
import {HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  schedName;
  subjectName;
  courseCode;
  arr;
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
  populateCodes(){
    return this.service.get(`api/courses/${this.subjectName}`)
  }
  populate() {
    this.populateCodes().subscribe((res: any) => {
      this.arr = res;
    });
  }
  makeSchedule() {
    return this.service.put(`api/schedule/${this.schedName}`, this.schedule, {responseType: 'text', observe: 'response'})
  }

  createSchedule() {
    this.makeSchedule().subscribe((res: any) => {
      console.log(res);
    })
  }

  addToSchedule(course) {
    return this.service.put(`api/make/schedule/${this.schedName}`,{"subject":this.subjectName, "catalog_nbr": course} , {responseType: 'text'});
  }

  addingSchedule(course) {
    this.addToSchedule(course).subscribe((res: any) => {
      console.log(res);
    })
  }

  removeSchedule() {
    return this.service.post(`api/remove/schedule/${this.schedName}`,this.schedule, {responseType: 'text'});
  }

  deleteSchedule() {
    this.removeSchedule().subscribe((res:any)=>{
      console.log(res);
    })
  }
  searchSchedule(){
    return this.service.get(`api/display/schedule/${this.schedName}`)
  }
  scheduleSearch(){
    this.searchSchedule().subscribe((res:any)=>{
      console.log(res.length);
      let classes = ""
      for (let i = 0; i<res.length;i++){
        classes += JSON.stringify(res[i][0].catalog_nbr)+ " Name: " + JSON.stringify(res[i][0].className) + JSON.stringify(res[i][0].catalog_description) + "\n\n"
      }
      document.getElementById("ShowResults").textContent = `Schedule: ${this.schedName} \n Classes: \n ` + classes;
    })
  }

  deleteAllSchedules() {
    return this.service.post(`api/schedulelist`,this.schedule,{responseType: 'text'})
  }
  deleteAll(){
    this.deleteAllSchedules().subscribe((res:any)=>{
      console.log(res);
    })
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
