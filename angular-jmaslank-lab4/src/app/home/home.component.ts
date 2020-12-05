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
  schedName = "";
  subjectName;
  courseCode;
  arr;
  description = "";
  email;
  password;
  newpassword;
  lists;
  review;
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


  addToSchedule(course,auth:string) {
    return this.service.put(`api/make/schedule/${this.schedName}/${auth}`,{"subject":this.subjectName, "catalog_nbr": course} , {responseType: 'text'});
  }

  addingSchedule(course) {
    if(this.subjectName == "" || course == null){
      alert("Invalid Subject/Code");
      return;
    }
    let authObject = {headers: {Authorization : "Bearer " + localStorage.getItem("jwt")}};
    this.addToSchedule(course,JSON.stringify(authObject)).subscribe((res: any) => {
      let temp = JSON.parse(res.body);
      if (temp.message == "failed"){
        this.router.navigate(['']);
      }
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
  setPublic(auth:string){
    return this.service.post(`api/set/public/${this.schedName}/${auth}`, this.schedule,{responseType: 'text'});
  }
  publicCall(){
    if(this.subjectName == ""){
      alert("Invalid Subject/Code");
      return;
    }
    let authObject = {headers: {Authorization : "Bearer " + localStorage.getItem("jwt")}};
    this.setPublic(JSON.stringify(authObject)).subscribe((res: any) => {
      let temp = JSON.parse(res.body);
      if (temp.message == "failed"){
        this.router.navigate(['']);
      }
    })
  }
  makeDesc(auth:string){
    return this.service.put(`api/make/description/${this.schedName}/${auth}`,{"description": this.description}, {responseType: 'text'});
  }
  descCall(){
    if (this.description == "") {
      alert("Invalid description")
      return;
    }
    let authObject = {headers: {Authorization : "Bearer " + localStorage.getItem("jwt")}};
    this.makeDesc(JSON.stringify(authObject)).subscribe((res: any) => {
      let temp = JSON.parse(res.body);
      if (temp.message == "failed"){
        this.router.navigate(['']);
      }
    })
  }
  makeSchedule(auth:string) {
    return this.service.put(`api/schedule/${this.schedName}/${auth}`, this.schedule, {responseType: 'text', observe: 'response'})
  }

  createSchedule() {
    if (this.schedName == ""){
      alert("Invalid Name for List")
      return;
    }
    let authObject = {headers: {Authorization : "Bearer " + localStorage.getItem("jwt")}};
    this.makeSchedule(JSON.stringify(authObject)).subscribe((res: any) => {
      let temp = JSON.parse(res.body);
      if (temp.message == "failed"){
        this.router.navigate(['']);
      }
    })
  }
  changePass(auth:string){
    return this.service.post(`api/updatepass/${this.password}/${this.email}/${auth}`, {newPass:this.newpassword},{responseType: 'text', observe: 'response'});
  }
  callChangePass(){
    let authObject = {headers: {Authorization : "Bearer " + localStorage.getItem("jwt")}};
    this.changePass(JSON.stringify(authObject)).subscribe((res: any) => {
    })
  }
  showUserCourses(auth:string){
    return this.service.get(`api/show/lists/${auth}`)
  }
  callUserCourses(){
    let authObject = {headers: {Authorization : "Bearer " + localStorage.getItem("jwt")}};
    this.showUserCourses(JSON.stringify(authObject)).subscribe((res:any)=>{
      this.lists = res;
    })
  }
  removeSchedule(auth:string,schedName:string) {
    return this.service.post(`api/remove/schedule/${schedName}/${auth}`,this.schedule, {responseType: 'text'});
  }

  deleteSchedule(schedName) {
    let confirmation = prompt("Please type CONFIRM to confirm deletion of list");
    if (confirmation =="CONFIRM") {
      let authObject = {headers: {Authorization: "Bearer " + localStorage.getItem("jwt")}};
      this.removeSchedule(JSON.stringify(authObject), schedName).subscribe((res: any) => {
      })
    } else {
      alert("Not Deleted");
    }
  }
  leaveReview(auth:string,courseCode){
    return this.service.post(`api/review/create/${auth}`, {subject: this.subjectName, courseCode: courseCode, review: this.review},{responseType: 'text'} )
  }
  callReview(courseCode){
    let authObject = {headers: {Authorization: "Bearer " + localStorage.getItem("jwt")}};
    this.leaveReview(JSON.stringify(authObject),courseCode).subscribe((res: any) => {

    })
  }
}
