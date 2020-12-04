import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../app.component";
import {HttpService} from "../http.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public arr: String[] = [];

  constructor(private service: HttpService) {
  }

  subjectVal;
  courseVal;
  arr2;
  ngOnInit(): void {
  }
  populateCodes(){
    return this.service.get(`api/courses/${this.subjectVal}`)
  }
  populate() {
    this.populateCodes().subscribe((res: any) => {
      this.arr2 = res;
      console.log(res);
    });
  }
  clearDisplay() {
    document.getElementById("DisplaySearch").textContent = "";
  }

  getSubjects() {
    return this.service.get('api/subject');
  }

  getData() {

    this.getSubjects().subscribe((res: any) => {
      this.arr = res;
      for (let i = 0; i < Object.keys(this.arr).length / 2; i++) {
        let list = document.createElement('li');
        let subjectNode = document.createTextNode(res["Subject code " + (i + 1)] + ": ");
        let nameNode = document.createTextNode(res["className " + (i + 1)]);
        list.appendChild(subjectNode);
        list.appendChild(nameNode);
        document.getElementById("allClasses").appendChild(list);
      }
    })
  }

  getSubjectCourse() {
    return this.service.get(`api/timetable/${this.subjectVal}/${this.courseVal}`);
  }

  searchSubjectCourse() {
    this.getSubjectCourse().subscribe((res: any) => {
      document.getElementById("subject").textContent = "Subject: " + JSON.stringify(res[0].subject);
      document.getElementById("catalog_nbr").textContent = "Course Code: " + JSON.stringify(res[0].catalog_nbr);
      document.getElementById("className").textContent = "Class: " + JSON.stringify(res[0].className);
      document.getElementById("class_section").textContent = "Section: " + JSON.stringify(res[0].course_info[0].class_section);
      document.getElementById("ssr_component").textContent = "Class Component(s): " + JSON.stringify(res[0].course_info[0].ssr_component);
    }, error => {
      console.log(error);
    })
  }



}
