import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-review-homework',
  templateUrl: './review-homework.component.html',
  styleUrls: ['./review-homework.component.css']
})
export class ReviewHomeworkComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  show: boolean = false;
  User: any = {};
  classList: any = [];
  subjects: any = [];
  ClsList: any = [];
  classes: any = [];
  model: any = {};
  submitted: any = false;
  Url: any = environment.baseUrl;
  resdata: any = {};
  roles: any = [];
  pList: any = [];
  pLists: any = [];
  permissionList: any = [];
  ps: any = 0;
  homeworks:any = [];
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private http: HttpClient, private formBuilder: FormBuilder,
    private router: Router, private el: ElementRef,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.User = this.local.getData('loginData');
    this.getClass();
    if (this.dataService.classId == undefined) {
      this.dataService.classId = '';
      this.dataService.streamId = '';
      this.dataService.clsIndex = '';
    }
    else {
      this.changeSubDynamic();
    }
    if (this.dataService.subjectId == undefined)
      this.dataService.subjectId = '';
    this.model = {
      classId: this.dataService.clsIndex,
      subjectId: this.dataService.subjectId
    }
    this.getPermission();
    this.homeWorks();
  }

  homeWorks(){
    this.ajaxService.getMethod({ class: this.dataService.classId,subject:this.dataService.subjectId,teacher:this.User._id,stream:this.dataService.streamId,fromUserId:this.User._id,fromUserType:'teacher' }, 'api/homework').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.homeworks = this.resdata.data;
        // if(this.homeworks!=null){
        //   if(this.homeworks.length>0)
        //   this.sortData();
        // }
        console.log(this.homeworks);
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

  reviewHomework(i){
    console.log('I value = '+i);
    this.dataService.setDataArray = this.homeworks[i];
    this.router.navigate(['/mark-homework']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }

  changeSubDynamic() {
    if (this.dataService.clsIndex != '' && this.dataService.clsIndex != undefined) {
      var l = this.classes[this.dataService.clsIndex];
      this.subjects = l.subjectName;
    }
  }

  getClass() {
    this.classList = this.User.teacherRole;
    var cls = [];
    var index = 0;
    var tVal = this;
    this.classList.forEach(function (element, index1) {
      var val = tVal.ClsList.indexOf(element.Classs._id + '-' + element.Stream._id);
      if (val == -1) {
        tVal.ClsList.push(element.Classs._id + '-' + element.Stream._id);
        cls[index] = [];
        cls[index]['subjectName'] = [];
        cls[index]['classId'] = element.Classs._id;
        cls[index]['roleId'] = element.Role._id;
        cls[index]['className'] = element.Classs.className;
        cls[index]['streamId'] = element.Stream._id;
        cls[index]['streamName'] = element.Stream.streamName;
        cls[index]['subjectName'].push({ sId: element.Subject._id, sName: element.Subject.subjectName });
        index++;
      } else {
        cls[val]['subjectName'].push({ sId: element.Subject._id, sName: element.Subject.subjectName });
      }
    });
    this.classes = cls;
    console.log(this.classes)
  }

  changeClass(event) {
    this.dataService.subjectId = '';
    this.model.subjectId = '';
    if (event.target.value != '') {
      this.dataService.classId = event.target.options[event.target.selectedIndex].getAttribute('data-class');
      this.dataService.streamId = event.target.options[event.target.selectedIndex].getAttribute('data-stream');
      this.dataService.roleId = event.target.options[event.target.selectedIndex].getAttribute('data-role');
      var val = event.target.options[event.target.selectedIndex].getAttribute('data-index');
      var l = this.classes[val];
      this.dataService.clsIndex = val;
      this.subjects = l.subjectName;
    } else {
      this.dataService.classId = '';
      this.dataService.streamId = '';
      this.dataService.roleId = '';
      this.dataService.clsIndex = '';
      this.subjects = [];
    }
    this.pList = [];
    this.pLists = [];
    this.getPermission();
    this.homeWorks();
  }

  getPermission() {
    if (this.dataService.roleId != undefined && this.dataService.roleId != '') {
      this.ajaxService.getMethod({ roleId: this.dataService.roleId }, 'api/permission/role').subscribe((val) => {
        this.resdata = val;
        if (this.resdata.status == true) {
          this.roles = this.resdata.data;
          this.permissionList = this.roles[0].permissionList;
          this.permissionList.forEach(element => {
            var p = [];
            p = element['Permission'];
            p.forEach(element1 => {
              this.pList.push(element1.permissionName);
            });
          });
          // console.log(this.pList);
          this.dataService.permissionList = this.pList;
          this.pLists = this.pList;
        } else {
          console.log('false');
        }
      }, err => {
        console.log(err);
      });
    } else {
      this.dataService.permissionList = [];
      this.pLists = [];
    }
  }

  changeSubject(id) {
    this.dataService.subjectId = id;
    this.homeWorks();
  }
}
