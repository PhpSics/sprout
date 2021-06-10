import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  @ViewChild('ec') ec: ElementRef;
  @ViewChild('closeBtns') closeBtns: ElementRef;
  show: boolean = false;
  showFirst: boolean = true;
  showSecond: boolean = false;
  showThird: boolean = false;
  message = '';
  User: any = {};
  resdata: any = {};
  schoolId: any = '';
  students: any = [];
  submitted = false;
  errorMessage: any = '';
  classes: any = [];
  classId: any = '';
  streamId: any = '';
  Url: any = environment.baseUrl;
  streams: any = [];
  Cstreams: any = [];
  studentAge = 0;
  model: any = {};
  editimgURL: any = 'http://primacollisionrepairs.co.nz/wp-content/uploads/2018/06/user-female-icon.png';
  searchText: any = '';
  maxYear = new Date();
  formData = new FormData;
  resdata1: any = [];
  classList: any = [];
  countryCode: any = 'in';
  ClsList: any = [];
  subjects: any = [];
  defImgSrc: any = environment.defaultUserImage;
  roles:any = [];
  permissionList:any = [];
  pList:any = [];
  pLists:any = [];
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private http: HttpClient,
    private router: Router, private el: ElementRef) { }

  ngOnInit() {
    this.User = this.local.getData('loginData');
    this.getClass();
    console.log(this.User);
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
    this.getStudents();
    this.getPermission();
  }

  back(val) {
    if (val == 3) {
      this.showThird = false;
      this.showSecond = true;
    }
    if (val == 2) {
      this.showSecond = false;
      this.showFirst = true;
    }
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
    this.getStudents();
  }

  changeSubDynamic() {
    if (this.dataService.clsIndex != '' && this.dataService.clsIndex != undefined) {
      var l = this.classes[this.dataService.clsIndex];
      this.subjects = l.subjectName;
    }
  }

  changeSubject(id) {
    this.dataService.subjectId = id;
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
          console.log(this.pList);
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

  viewProfile(index) {
    this.dataService.studentData = index;
    this.router.navigate(['/student-profile']);
  }

  getStudents() {
    console.log(this.User)
    this.ajaxService.getMethod({ school: this.User.teacherSchool, class: this.dataService.classId, stream: this.dataService.streamId }, 'api/student').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.students = this.resdata.data;
        // console.log(this.students);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }
  
  //call this wherever you want to close modal
  private closeModals(): void {
    this.closeBtns.nativeElement.click();
  }
}
