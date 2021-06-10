import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  _classId: string;
  _chatRoomId: string;
  _chatRoom: string;
  _streamId: string;
  _subjectId: string;
  _studentData:any = {};
  _clsIndex:any = '';
  _roleId:any = '';
  _inc:any = 0;
  _permissionList: any = [];
  _setDataArray:any = {};

  get chatRoomId(): string {
    return this._chatRoomId;
  }  

  set chatRoomId(value: string) {
    this._chatRoomId = value;
  }
  
  get chatRoom(): string {
    return this._chatRoom;
  }  

  set chatRoom(value: string) {
    this._chatRoom = value;
  }

  get setDataArray(): {} {
    return this._setDataArray;
  }  

  set setDataArray(value: {}) {
    this._setDataArray = value;
  }  
  
  set classId(value: string) {
    this._classId = value;
  }
  get classId(): string {
    return this._classId;
  }

  set inc(value: string) {
    this._inc = value;
  }
  get inc(): string {
    return this._inc;
  }

  set permissionList(value: []) {
    this._permissionList = value;
  }
  get permissionList(): [] {
    return this._permissionList;
  }

  set roleId(value: string) {
    this._roleId = value;
  }
  get roleId(): string {
    return this._roleId;
  }

  set clsIndex(value: string) {
    this._clsIndex = value;
  }
  get clsIndex(): string {
    return this._clsIndex;
  }

  set streamId(value: string) {
    this._streamId = value;
  }
  get streamId(): string {
    return this._streamId;
  }

  set subjectId(value: string) {
    this._subjectId = value;
  }
  get subjectId(): string {
    return this._subjectId;
  }

  set studentData(value: string) {
    this._studentData = value;
  }
  get studentData(): string {
    return this._studentData;
  }

  constructor() { }

  isLogged() {
    if(localStorage.getItem('loginData')=='null'){
      return false;
    }else return true;
  }
}
