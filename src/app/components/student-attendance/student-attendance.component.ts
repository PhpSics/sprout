import { Subject } from "rxjs";
import { ChangeDetectionStrategy, ViewChild, TemplateRef, Component, OnInit, ElementRef } from "@angular/core";
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { DatePipe } from '@angular/common';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from "date-fns";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from "angular-calendar";

const colors: any = {
  red: {
    primary: "red",
    secondary: "red"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  green: {
    primary: "green",
    secondary: "green"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  }
};

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css']
})
export class StudentAttendanceComponent implements OnInit {
  @ViewChild('reason') reason: ElementRef<HTMLElement>;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild(NgForm) myForm: NgForm;
  @ViewChild('content') content: ElementRef;
  @ViewChild("modalContent")
  modalContent: TemplateRef<any>;
  events: CalendarEvent[] = [];
  Presentevents: CalendarEvent[] = [];
  calEvents: any = [];
  refresh: Subject<any> = new Subject();
  view: CalendarView = CalendarView.Month;
  EventList: any = [];
  CalendarView = CalendarView;
  excelArr: any = [];
  ShowTable: any = false;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  subjects: any = [];
  User: any = {};
  resdata: any = {};
  model: any = {};
  errorMessage: any = '';
  reasonVal: any = '';
  submitted: any = false;
  presentC: any = 0;
  absentC: any = 0; 0;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private router: Router,private datePipe: DatePipe) {
    if (this.dataService.studentId == undefined) {
      this.router.navigate(['/students']);
      return;
    }
  }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.model = {
      studentId: '',
      date: '',
      reason: '',
      reasons: '',
      classId: '',
      stream: '',
      subjectId: '',
      fromName: this.User.userName,
      fromImage: this.User.userImage,
      teacherId: '',
      studentName: ''
    }
    this.getAdminEvents(new Date());
    this.getSubject();
  }

  getSubject() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/subject').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.subjects = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
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

  getAdminEvents(val) {
    // console.log(val);
    this.ShowTable = false;
    var dateVal = this.datetostr(val);
    var mrt = dateVal.toString().slice(0, 6);
    var mnth = parseInt(mrt);
    this.ajaxService.getMethod({ studentId: this.dataService.studentId, fromUserType: 'admin', fromUserId: this.User._id, subjectId: '', month: mnth }, 'api/parent/attendence').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.calEvents = this.resdata.data;
        this.presentC = this.calEvents.present.length;
        this.absentC = this.calEvents.absent.length;
        // console.log(this.calEvents)
        this.events = [];
        this.calEvents.absent.forEach(element => {
          this.events.push({
            start: new Date(element.date),
            end: new Date(element.date),
            title: element.reason,
            color: colors.red
          });
        });
        this.Presentevents = [];
        this.calEvents.present.forEach(element => {
          this.events.push({
            start: new Date(element.date),
            end: new Date(element.date),
            title: 'Present',
            color: colors.green
          });
        });
      }
    });
  }

  dayClicked(val) {
    this.EventList = [];
    var m = this;
    val.events.forEach(element => {
      if (this.EventList.indexOf(element) == -1) {
        if (element.title != 'Present') {
          if (element.title == '') {
            let el: HTMLElement = this.reason.nativeElement;
            el.click();
            // console.log(this.dataService.studArray)
            m.model.classId = m.dataService.studArray['studentClass']._id;
            m.model.stream = m.dataService.studArray['studentStream']._id;
            m.model.studentId = m.dataService.studArray['_id'];
            var d = element.start;
            var date = d.getDate();
            var month = d.getMonth() + 1;
            if (d.getDate() < 10) {
              date = '0' + date;
            } if (month < 10) {
              month = '0' + month;
            }
            var fdate = d.getFullYear() + '-' + month + '-' + date + 'T00:00:00.000Z';
            m.model.date = fdate;
            // console.log(fdate)
          } else {
            this.EventList.push(element);
          }
        }
      }
    });
    // console.log(this.model)
    this.ShowTable = true;
  }

  onSubmit() {
    this.submitted = true;
    this.ajaxService.putUpMethod('api/attendance/reason', this.model).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.submitted = false;
          this.myForm.resetForm();
          this.model = {
            studentId: '',
            date: '',
            reason: '',
            reasons: '',
            classId: '',
            stream: '',
            subjectId: '',
            fromName: this.User.userName,
            fromImage: this.User.userImage,
            teacherId: '',
            studentName: ''
          }
          this.reasonVal = '';
          this.getAdminEvents(new Date())
          this.closeModal();
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        // console.log(err);
      });
  }

  changeMe(val) {
    this.reasonVal = val;
    if (val != 'Other')
      this.model.reason = val;
    else
      this.model.reason = '';
  }

  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  public downloadPDF() {
    this.excelArr = [];
    this.excelArr.push({ first: 'Total Days Present', second: 'Total Days Absent', third: 'Total Days Attendance Taken' });
    this.excelArr.push({ first: this.presentC, second: this.absentC, third: this.calEvents['attendanceCount'] });
    new Angular5Csv(this.excelArr, 'AttendanceReport'+this.datePipe.transform(this.viewDate, 'MM-yyyy'));    
  }
}
