import { Component, OnInit} from '@angular/core';
import {HttpService} from "./http.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-jmaslank-lab4';
  constructor(private service : HttpService){

  }
  ngOnInit(){
    this.getDataFromAPI();
  }
  getDataFromAPI(){
    this.service.getSubjects().subscribe((response) => {
      console.log('response is ', response)
    }, (error) =>{
      console.log(error);
    })
  }
}
