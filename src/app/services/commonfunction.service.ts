import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Response } from 'selenium-webdriver/http';
import { catchError,map } from "rxjs/operators";

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CommonfunctionService {

  url = environment.baseUrl;

  constructor(private http: HttpClient) { }


  // http methods

  postMethod(key, params) {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');

    return this.http
      .post(this.url + key, params, { headers: headers })
      .pipe(map(res => res));
      
  }

  putUpMethod(key, params) {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');

    return this.http
      .put(this.url + key, params, { headers: headers })
      .pipe(map(res => res));
      
  }

  getMethod(param, path) {
    let params: HttpParams = new HttpParams();
    for (const key of Object.keys(param)) {
      if (param[key]) {
        if (param[key] instanceof Array) {
          param[key].forEach((item) => {
            params = params.append(`${key.toString()}[]`, item);
          });
        } else {
          params = params.append(key.toString(), param[key]);
        }
      }
    }
    return this.http.get(this.url + path, {params : params})
      .pipe(map(res => res));
  }

  getDirectMethod(param, path) {
    let params: HttpParams = new HttpParams();
    for (const key of Object.keys(param)) {
      if (param[key]) {
        if (param[key] instanceof Array) {
          param[key].forEach((item) => {
            params = params.append(`${key.toString()}[]`, item);
          });
        } else {
          params = params.append(key.toString(), param[key]);
        }
      }
    }
    return this.http.get(path, {params : params})
      .pipe(map(res => res));
  }

  authgetMethod(param, path, authtoken) {
    let params: HttpParams = new HttpParams();
    for (const key of Object.keys(param)) {
      if (param[key]) {
        if (param[key] instanceof Array) {
          param[key].forEach((item) => {
            params = params.append(`${key.toString()}[]`, item);
          });
        } else {
          params = params.append(key.toString(), param[key]);
        }
      }
    }
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('authtoken', authtoken);
    const options = { params: params, headers: headers};
    return this.http.get(this.url + path, options)
      .pipe(map(res => res));
  }

  putMethod(key, params, authtoken) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('authtoken', authtoken);
    return this.http.put(this.url + key, params, { headers: headers })
    .pipe(map(res => res));

  }

  //
  // common functions

    // date to string function
    datetostr(dt) {
      let nM : any;
      let nY = dt.getFullYear();
      if (dt.getMonth() < 10) {
        nM = '0' + dt.getMonth();
      } else {
        nM = dt.getMonth();
      }
      let cD = nY + '' + nM;
      return cD;
    }

}
