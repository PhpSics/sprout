import { Injectable, Inject } from '@angular/core';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  RouteData: any;

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  storeData(key, value) {
    this.storage.set(key, value);
  }

  getData(key) {
    let Data = this.storage.get(key);
    return Data;
  }

}
