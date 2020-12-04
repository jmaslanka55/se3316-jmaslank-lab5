import {Component, OnInit} from '@angular/core';
import {HttpService} from "../http.service";
import {HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Router, RouterModule} from "@angular/router";

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
  constructor(private service: HttpService,private router: Router) {
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
  makeSchedule(auth:string) {
    return this.service.put(`api/schedule/${this.schedName}/${auth}`, this.schedule, {responseType: 'text', observe: 'response'})
  }

  createSchedule() {
    let authObject = {headers: {Authorization : "Bearer " + localStorage.getItem("jwt")}};
    this.makeSchedule(JSON.stringify(authObject)).subscribe((res: any) => {
      let temp = JSON.parse(res.body);
      if (temp.message == "failed"){
        this.router.navigate(['']);
      }
    })
  }

  addToSchedule(course,auth:string) {
    return this.service.put(`api/make/schedule/${this.schedName}/${auth}`,{"subject":this.subjectName, "catalog_nbr": course} , {responseType: 'text'});
  }

  addingSchedule(course) {
    let authObject = {headers: {Authorization : "Bearer " + localStorage.getItem("jwt")}};
    this.addToSchedule(course,JSON.stringify(authObject)).subscribe((res: any) => {
      let temp = JSON.parse(res.body);
      if (temp.message == "failed"){
        this.router.navigate(['']);
      }
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
