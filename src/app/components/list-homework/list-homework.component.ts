import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-list-homework',
  templateUrl: './list-homework.component.html',
  styleUrls: ['./list-homework.component.css']
})
export class ListHomeworkComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  homeworkForm: FormGroup;
  User: any = {};
  resdata: any = {};
  submitted: boolean = false;
  Url: any = environment.baseUrl;
  class:any = [];
  streams:any = [];
  subjects:any = [];
  streamId:any = '';
  classId:any = '';
  homeworks:any = [];
  homework:any = [];
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private el: ElementRef, private dataService: DataService) {
      if (this.dataService.showClass == undefined) {
        this.router.navigate(['/class-management']);
        return;
      }
     }

  ngOnInit() {
    if (this.dataService.showClass == undefined) {
      this.router.navigate(['/class-management']);
      return;
    }
    this.User = this.local.getData('AdminloginData');
    this.homeworkForm = this.formBuilder.group({
      classId: [this.dataService.showClass],
      streamId: [this.dataService.showStream]
    });
    this.getHomeworks();
    this.getClass();
    this.changeClass(this.dataService.showClass);
  }

  getHomeworks(){
    this.ajaxService.getMethod({ class: this.dataService.showClass,stream:this.dataService.showStream,userType:'admin' }, 'api/homework').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.homeworks = this.resdata.data;
        this.sortData();
        // console.log(this.homeworks)
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  sortData() {
    return this.homeworks.sort((a, b) => {
      return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
    });
  }

  reviewHomework(id,i){
    this.dataService.chatRoomId = id;
    this.dataService.setDataArray = this.homeworks[i];
    this.router.navigate(['/review-homework']);
  }

  getClass() {
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.class = this.resdata.data;
        // console.log(this.class);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeClass(id) {
    this.dataService.showClass = id;
    this.ajaxService.getMethod({ classId: id }, 'api/class/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.streams = this.resdata.data;
        this.getHomeworks();
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeStream(id){
    this.dataService.showStream = id;
    this.getHomeworks();
  }
}
