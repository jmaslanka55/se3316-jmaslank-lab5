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
      document.getElementById("Subjects").textContent = JSON.stringify(this.arr);
    })
  }

}
