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
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-take-attendance',
  templateUrl: './take-attendance.component.html',
  styleUrls: ['./take-attendance.component.css']
})
export class TakeAttendanceComponent implements OnInit {
  errorMessage: any = '';
  @ViewChild('closeBtn') closeBtn: ElementRef;
  show: boolean = false;
  User: any = {};
  classList: any = [];
  subjects: any = [];
  ClsList: any = [];
  class: any = [];
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
  reviews: any = [];
  reason: any = {
    absentDates: []
  };
  streams: any = [];
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private http: HttpClient, private formBuilder: FormBuilder,
    private router: Router, private el: ElementRef, public dialog: MatDialog) {
    if (this.dataService.showClass == undefined || this.dataService.showClass == '') {
      this.router.navigate(['/class-management']);
      return;
    }
  }

  ngOnInit() {
    if (this.dataService.showClass == undefined || this.dataService.showClass == '') {
      this.router.navigate(['/class-management']);
      return;
    }
    this.User = this.local.getData('AdminloginData');
    this.getClass();
    this.Atmodel = {
      attendance: []
    }
    if (this.dataService.showClass != undefined) {
      this.changeInitialClass(this.dataService.showClass);
    }
    this.model = {
      classId: this.dataService.showClass,
      streamId: this.dataService.showStream
    }
  }

  showReason(i) {
    this.reason = this.reviews[i];
  }

  getClass() {
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.class = this.resdata.data;
        console.log(this.class);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeClass(id) {
    this.dataService.showStream = '';
    this.dataService.showClass = id;
    this.ajaxService.getMethod({ classId: id }, 'api/class/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.streams = this.resdata.data;
        this.getAttendance();
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeInitialClass(id) {
    this.dataService.showClass = id;
    this.ajaxService.getMethod({ classId: id }, 'api/class/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.streams = this.resdata.data;
        this.getAttendance();
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
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

  getAttendance() {
    // console.log('getAtt')
    this.reviews = [];
    var dateVal = this.datetostr(new Date());
    var mrt = dateVal.toString().slice(0, 6);
    var mltc = parseInt(mrt);
    this.ajaxService.getMethod({ classId: this.dataService.showClass, stream: this.dataService.showStream, date: dateVal, month: mltc }, 'api/attendance/classstud?subjectId=').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.attendances = this.resdata.data;
        this.Atmodel.attendance = [];
        var modelVal = this.Atmodel;
        this.isAtt = false;
        if(this.attendances.length==0) this.isAtt = true;
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
        this.reviewAttendance();
        // console.log(this.model)
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeStream(id) {
    this.dataService.showStream = id;
    this.getAttendance();
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
      if (element.status == true) {
        attndModel[index].status = 'present';
        dVal.isAtt = true;
        abs++;
      }
      else attndModel[index].status = 'absent';
      attndModel[index].classId = dVal.dataService.showClass;
      attndModel[index].fromImage = dVal.User._id;
      attndModel[index].fromName = dVal.User.userName;
      attndModel[index].schoolId = dVal.User.schoolId;
      attndModel[index].stream = dVal.dataService.showStream,
        attndModel[index].studentId = element.studentId,
        attndModel[index].subjectId = '',
        attndModel[index].teacherId = ''
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

  showAlert() {
    let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
      width: '350px',
      data: "Submit attendance before review"
    });
    dialogRef1.afterClosed().subscribe(result => {
    });
  }

  reviewAttendance() {
    var dateVal = this.datetostr(new Date());
    var mrt = dateVal.toString().slice(0, 6);
    var mltc = parseInt(mrt);
    this.ajaxService.getMethod({ classId: this.dataService.showClass, stream: this.dataService.showStream, month: mltc }, 'api/attendance').subscribe((val) => {
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
