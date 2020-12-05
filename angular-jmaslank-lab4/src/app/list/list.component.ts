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

  keyVal;
  subjectVal = "";
  courseVal;
  arr2;

  ngOnInit(): void {
  }

  populateCodes() {
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

  getSubjectCourse() {
    return this.service.get(`api/timetable/${this.subjectVal}/${this.courseVal}`);
  }

  getcourseCode() {
    return this.service.get(`api/coursecode/${this.courseVal}`);
  }

  searchSubjectCourse() {
    if (this.subjectVal == "") {
      console.log("poop");
      this.getcourseCode().subscribe((res: any) => {
        for (let i = 0; i < res.length; i++) {
          let list = document.createElement('li');
          let subjectNode = document.createTextNode("Subject: " + JSON.stringify(res[i].subject));
          let courseNode = document.createTextNode("Course Code: " + JSON.stringify(res[i].catalog_nbr));
          let nameNode = document.createTextNode("Class: " + JSON.stringify(res[i].className));
          let sectionNode = document.createTextNode("Section: " + JSON.stringify(res[i].course_info[0].class_section));
          let componentNode = document.createTextNode("Class Component(s): " + JSON.stringify(res[i].course_info[0].ssr_component));
          list.appendChild(subjectNode);
          list.appendChild(courseNode);
          list.appendChild(nameNode);
          list.appendChild(sectionNode);
          list.appendChild(componentNode);
          document.getElementById("results").appendChild(list);
        }
      })
      return;
    }
    this.getSubjectCourse().subscribe((res: any) => {

      for (let i = 0; i < res.length; i++) {
        let list = document.createElement('li');
        let subjectNode = document.createTextNode("Subject: " + JSON.stringify(res[i].subject));
        let courseNode = document.createTextNode("Course Code: " + JSON.stringify(res[i].catalog_nbr));
        let nameNode = document.createTextNode("Class: " + JSON.stringify(res[i].className));
        let sectionNode = document.createTextNode("Section: " + JSON.stringify(res[i].course_info[0].class_section));
        let componentNode = document.createTextNode("Class Component(s): " + JSON.stringify(res[i].course_info[0].ssr_component));
        list.appendChild(subjectNode);
        list.appendChild(courseNode);
        list.appendChild(nameNode);
        list.appendChild(sectionNode);
        list.appendChild(componentNode);
        document.getElementById("results").appendChild(list);
      }
    }, error => {
      console.log(error);
    })
  }

  getKeywordSearch() {
    return this.service.get(`api/courses/keyword/${this.keyVal}`);
  }

  searchKeyword() {
    this.getKeywordSearch().subscribe((res: any) => {
      if (this.keyVal.length < 4) {
        alert("Keyword must be 4 characters or more");
        return;
      }
      let list = document.createElement('ol');
      for (let i = 0; i < res.length; i++) {
        let course = document.createElement('li');
        course.appendChild((document.createTextNode("Subject: " + JSON.stringify(res[i].subject) + "\t\t")));
        course.appendChild((document.createTextNode("Course Code: " + JSON.stringify(res[i].catalog_nbr) + "\t\t")));
        course.appendChild((document.createTextNode("Class: " + JSON.stringify(res[i].className) + "\t\t")));
        course.appendChild((document.createTextNode("Section: " + JSON.stringify(res[i].course_info[0].class_section) + "\t\t")));
        course.appendChild((document.createTextNode("Class Component: " + JSON.stringify(res[i].course_info[0].ssr_component) + "\t\t")));
        list.appendChild(course);
      }
      document.getElementById("allClasses").appendChild(list)
    })
  }

  publicLists() {
    return this.service.get(`api/publiclists`);
  }

  callPublic() {
    this.publicLists().subscribe((res: any) => {
        document.getElementById("pLists").textContent = res;
      }
    )
  }

  populatePublic() {
    return this.service.get('api/public/list');
  }

  callPopulate() {
    this.populatePublic().subscribe((res: any) => {
      console.log(res);
      this.arr2 = res;
    })
  }

  getTimetable(name) {
    return this.service.get(`api/public/list/${name}`)
  }

  callTimetables(name) {
    this.getTimetable(name).subscribe((res: any) => {
      let classes = "";
      for (let i = 0; i < res.length; i++) {
        classes += JSON.stringify(res[i][0].catalog_nbr) + " Name: " + JSON.stringify(res[i][0].className) + JSON.stringify(res[i][0].catalog_description) + "\n\n"
      }
      document.getElementById("ERROR").textContent = `List: ${name} Classes: ` + classes;
    })
  }


}
