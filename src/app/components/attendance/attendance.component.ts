import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  errorMessage: any = '';
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
  Atmodel: any = {};
  Atmodel1: any = {};
  attendanceModel: any = [];
  attendances: any = [];
  defImgUrl = environment.defaultUserImage;
  isAtt: boolean = false;
  reviews:any = [];
  reason:any = {
    absentDates:[]
  };
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private http: HttpClient, private formBuilder: FormBuilder,
    private router: Router, private el: ElementRef,
    private _snackBar: MatSnackBar,public dialog: MatDialog) { }

  ngOnInit() {
    this.User = this.local.getData('loginData');
    this.getClass();
    this.Atmodel = {
      attendance: []
    }
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
  }

  openDialog(): void {
    var abs = 0;
    this.Atmodel1.attendance.forEach(function (element, index) {
      if (element.status == true){
        abs++;
      }
    });
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: abs+'/'+this.Atmodel1['attendance'].length+" students are in attendance today"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitAttendance();
      }
    });
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
      this.getAttendance();
    }
  }

  showReason(i){
    this.reason = this.reviews[i];
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
    // console.log(this.classes)
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
    this.Atmodel = {
      attendance: []
    }
    this.Atmodel1 = this.Atmodel;
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
    this.Atmodel = {
      attendance: []
    }
    this.Atmodel1 = this.Atmodel;
    this.isAtt = false;
    if (id != '')
      this.getAttendance();
  }

  getAttendance() {
    // console.log('getAtt')
    var dateVal = this.datetostr(new Date());
    var mrt = dateVal.toString().slice(0, 6);
    var mltc = parseInt(mrt);
    this.ajaxService.getMethod({ classId: this.dataService.classId, stream: this.dataService.streamId, subjectId: '', date: dateVal, month: mltc }, 'api/attendance/classstud').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.attendances = this.resdata.data;
        var modelVal = this.Atmodel;
        var thisVal = this;
        var status = false;
        this.attendances.forEach(function (element, index) {
          // console.log(modelVal)
          status = false;
          if (element.status == 'present') {
            status = true;
            thisVal.isAtt = true;
          }
          modelVal.attendance.push({
            id: index,
            status: status,
            studentId: element.studentId._id,
            studentName: element.studentId.studentName,
            studentImage: element.studentId.studentImage
          });
        });
        this.Atmodel1 = this.Atmodel;
        // console.log(this.model)
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeDateFormat(today) {
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    today = mm + '/' + dd + '/' + yyyy;
    return today;
  }

  datetostr(dt) {
    var nY = dt.getFullYear();
    var nM; var nDa;
    if (dt.getMonth() < 10) {
      nM = '0' + dt.getMonth();
    } else {
      nM = dt.getMonth();
    }
    if (dt.getDate() < 10) {
      nDa = '0' + dt.getDate();
    } else {
      nDa = dt.getDate();
    }
    var cD = nY + '' + nM + '' + nDa;
    return parseInt(cD);
  }

  submitAttendance() {
    var attndModel = this.attendanceModel;
    var dVal = this;
    var abs = 0;
    this.Atmodel1.attendance.forEach(function (element, index) {
      attndModel[index] = {};
      if (element.status == true){
        attndModel[index].status = 'present';
        dVal.isAtt = true;
        abs++;
      }
      else attndModel[index].status = 'absent';
      attndModel[index].classId = dVal.dataService.classId;
      attndModel[index].fromImage = dVal.User._id;
      attndModel[index].fromName = dVal.User.teacherName;
      attndModel[index].schoolId = dVal.User.teacherSchool;
      attndModel[index].stream = dVal.dataService.streamId,
      attndModel[index].studentId = element.studentId,
      attndModel[index].subjectId = '',
      attndModel[index].teacherId = dVal.User._id
    });
    this.ajaxService.postMethod('api/attendance', this.attendanceModel).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
            width: '350px',
            data: "Attendance Added."
          });
          dialogRef1.afterClosed().subscribe(result => {
          });
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

  showAlert(){
    let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
      width: '350px',
      data: "Submit attendance before review"
    });
    dialogRef1.afterClosed().subscribe(result => {
    });
  }

  reviewAttendance(){
    var dateVal = this.datetostr(new Date());
    var mrt = dateVal.toString().slice(0, 6);
    var mltc = parseInt(mrt);
    this.ajaxService.getMethod({ classId: this.dataService.classId, stream: this.dataService.streamId, subjectId: '', month: mltc }, 'api/attendance').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.reviews = this.resdata.data;
        // console.log(this.reviews)
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

}
