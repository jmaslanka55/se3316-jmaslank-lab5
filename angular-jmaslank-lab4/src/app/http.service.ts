import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  ROOT_URL;
  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000'
  }


  get(address: string) {
    address = `${this.ROOT_URL}/${address}`;
    return this.http.get(address).pipe(catchError(this.handleError));
  }

  post(address: string, info: object) {
    address = `${this.ROOT_URL}/${address}`;
    return this.http.post(address, info);
  }

  put(address: string, info: object) {
    address = `${this.ROOT_URL}/${address}`;
    return this.http.post(address, info);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
