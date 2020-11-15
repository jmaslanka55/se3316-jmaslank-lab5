import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";
import {HttpService} from "../http.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public arr: [];
  constructor(private service: HttpService) { }

  ngOnInit(): void {
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
    let subjectVal = (document.getElementById("subjectSearch") as HTMLTextAreaElement).value.toUpperCase();
    let courseVal = (document.getElementById("courseSearch") as HTMLTextAreaElement).value.toUpperCase();
    return this.service.get(`api/timetable/${subjectVal}/${courseVal}`);
  }
  searchSubjectCourse(){
    this.getSubjectCourse().subscribe((res:any)=>{
      res = JSON.stringify(res[0].className) + JSON.stringify(res[0].catalog_description) + JSON.stringify(res[0].course_info[0].start_time);
      document.getElementById("DisplaySearch").textContent = res;
    })
  }

}
