import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";
import {HttpService} from "../http.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public arr: String[] = [];
  constructor(private service: HttpService) { }
  subjectVal;
  courseVal;
  component;
  ngOnInit(): void {
  }

  clearDisplay(){
    document.getElementById("AllSubjects").textContent ="";
    document.getElementById("DisplaySearch").textContent = "";
  }
  getSubjects(){
    return this.service.get('api/subject')
  }
  getData(){
    this.getSubjects().subscribe((res : any) =>{
      this.arr = res;
      document.getElementById("AllSubjects").textContent = JSON.stringify(this.arr);
    })
  }
  getSubjectCourse(){
    return this.service.get(`api/timetable/${this.subjectVal}/${this.courseVal}`);
  }
  searchSubjectCourse(){
    this.getSubjectCourse().subscribe((res:any)=>{
      res = JSON.stringify(res[0].className) + JSON.stringify(res[0].catalog_description) + JSON.stringify(res[0].course_info[0].start_time);
      document.getElementById("DisplaySearch").textContent = res;
    })
  }
  getSubjectCourseComponent(){
    return this.service.get(`api/timetable/${this.subjectVal}/${this.courseVal}/${this.component}`);
  }
  searchSubjectCourseComponent(){
    this.getSubjectCourseComponent().subscribe((res: any)=>{
      res = JSON.stringify(res[0].className) + JSON.stringify(res[0].catalog_nbr) + JSON.stringify(res[0].catalog_description) + JSON.stringify(res[0].course_info[0].start_time)
        + JSON.stringify(res[0].course_info[0].ssr_component);
      document.getElementById("DisplaySearch").textContent = res;
    })
  }

}
