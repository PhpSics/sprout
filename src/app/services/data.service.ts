import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  _showTour: string;
  _studentId: string;
  _studentClass: string;
  _studentImage: string;
  _studentName: string;
  _showTerm: string;
  _showCatName: string;
  _showClass: string;
  _showStream: string;
  _showTermName: string;
  _showcName: string;
  _showfdt: string;
  _showtdt: string;
  _showFee: string;
  _showFeeName: string;
  _showAmount: string;
  _getTeacher:string;
  _chatRoomId:string;
  _chatType:string;
  _setName:string;
  _setImage:string;
  _setDataArray:string;
  _classId:string;
  _streamId:string;
  _termId:string;
  _studArray:any ={};
  _setHwrkData:any = {};

  get setHwrkData(): {} {
    return this._setHwrkData;
  }  

  set setHwrkData(value: {}) {
    this._setHwrkData = value;
  }  

  set classId(value: string) {
    this._classId = value;
  }

  set termId(value: string) {
    this._termId = value;
  }

  get termId(): string {
    return this._termId;
  }

  get classId(): string {
    return this._classId;
  }
  
  set studArray(value: string) {
    this._studArray = value;
  }

  get studArray(): string {
    return this._studArray;
  } 

  set streamId(value: string) {
    this._streamId = value;
  }

  get streamId(): string {
    return this._streamId;
  }

  set showTour(value: string) {
    this._showTour = value;
  }

  set setDataArray(value: string) {
    this._setDataArray = value;
  }

  set setImage(value: string) {
    this._setImage = value;
  }

  set setName(value: string) {
    this._setName = value;
  }

  set chatType(value: string) {
    this._chatType = value;
  }

  set chatRoomId(value: string) {
    this._chatRoomId = value;
  }

  set studentName(value: string) {
    this._studentName = value;
  }

  set studentImage(value: string) {
    this._studentImage = value;
  }

  set studentClass(value: string) {
    this._studentClass = value;
  }

  set studentId(value: string) {
    this._studentId = value;
  }

  set getTeacher(value: string) {
    this._getTeacher = value;
  }

  set showFeeName(value: string) {
    this._showFeeName = value;
  }

  set showFee(value: string) {
    this._showFee = value;
  }

  set showfdt(value: string) {
    this._showfdt = value;
  }

  set showtdt(value: string) {
    this._showtdt = value;
  }

  set showcName(value: string) {
    this._showcName = value;
  }

  set showTermName(value: string) {
    this._showTermName = value;
  }

  set showAmount(value: string) {
    this._showAmount = value;
  }

  set showTerm(value: string) {
    this._showTerm = value;
  }

  set showClass(value: string) {
    this._showClass = value;
  }

  set showStream(value: string) {
    this._showStream = value;
  }

  set showCatName(value: string) {
    this._showCatName = value;
  }

  get showTour(): string {
    return this._showTour;
  }

  get showTerm(): string {
    return this._showTerm;
  }

  get showTermName(): string {
    return this._showTermName;
  }

  get showcName(): string {
    return this._showcName;
  }

  get showClass(): string {
    return this._showClass;
  }

  get showStream(): string {
    return this._showStream;
  }

  get showCatName(): string {
    return this._showCatName;
  }

  get showfdt(): string {
    return this._showfdt;
  }

  get getTeacher(): string {
    return this._getTeacher;
  }

  get showtdt(): string {
    return this._showtdt;
  }

  get showFee(): string {
    return this._showFee;
  }

  get showFeeName(): string {
    return this._showFeeName;
  } 
  
  get studentId(): string {
    return this._studentId;
  }

  get studentName(): string {
    return this._studentName;
  }

  get chatRoomId(): string {
    return this._chatRoomId;
  }

  get studentClass(): string {
    return this._studentClass;
  }
  get studentImage(): string {
    return this._studentImage;
  } 

  get chatType(): string {
    return this._chatType;
  } 

  get setImage(): string {
    return this._setImage;
  } 

  get showAmount(): string {
    return this._showAmount;
  } 
  
  get setName(): string {
    return this._setName;
  } 

  get setDataArray(): string {
    return this._setDataArray;
  }  

  constructor() { }
  isLogged() {
    if(localStorage.getItem('AdminloginData')=='null'){
      return false;
    }else return true;
  }
}
