import { Subject } from "rxjs";
import { ChangeDetectionStrategy,ElementRef, ViewChild, TemplateRef, Component, OnInit } from "@angular/core";
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

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
    primary: "#0062cc",
    secondary: "#FAE3E3"
  },
  blue: {
    primary: "#0062cc",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  teachers: any = [];
  teachers1: any = [];
  @ViewChild('closeBtn') closeBtn: ElementRef;
  submitted: any = false;
  @ViewChild("modalContent")
  modalContent: TemplateRef<any>;
  events: CalendarEvent[] = [];
  calEvents: any = [];
  refresh: Subject<any> = new Subject();
  view: CalendarView = CalendarView.Month;
  EventList: any = [];
  CalendarView = CalendarView;
  ShowTable: any = false;
  viewDate: Date = new Date();
  termForm: FormGroup;
  classList: any = [];
  subjects: any = [];
  ClsList: any = [];
  classes: any = [];
  model: any = {};
  roles: any = {};
  permissionList: any = [];
  pList: any = [];
  pLists: any = [];
  dropdownSettings: any = {};
  dropdownSettings1: any = {};
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  User: any = {};
  resdata: any = {};
  constructor(private ajaxService: CommonfunctionService,
    private formBuilder: FormBuilder,
    private local: LocalstorageService, private dataService: DataService,private el: ElementRef) { }

  ngOnInit() {
    this.User = this.local.getData('loginData');
    this.getTeacherEvents(new Date());
    this.getClass();
    this.getTeachers();
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
    this.termForm = this.formBuilder.group({
      fromName: [this.User.teacherName],
      fromImage: [this.User.teacherImage],
      schoolId: [this.User.teacherSchool],
      teacherId: [this.User._id],
      eventTopic: ['', [Validators.required]],
      eventTask: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      eventStarttime: ['', [Validators.required]],
      eventEndtime: ['', [Validators.required]],
      guestteacher: [[]],
      guestClass: [[]]
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'teacherName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'ind',
      textField: 'cName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
  }

  getTeachers() {
    this.ajaxService.getMethod({ schoolId: this.User.teacherSchool }, 'api/teacher').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.teachers1 = this.resdata.data;
        var f = [];
        this.teachers1.forEach(element => {
          if(element._id!=this.User._id)
            f.push(element);
        });
        this.teachers = f;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  get f() { return this.termForm.controls; }

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
        cls[index]['ind'] = index;
        cls[index]['className'] = element.Classs.className;
        cls[index]['cName'] = element.Classs.className + ' ' + element.Stream.streamName;
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
  }


  getTeacherEvents(val) {
    console.log(val)
    var mrt = this.dateToStr(val).toString();
    mrt = mrt.slice(0, 6);
    var mltc = parseInt(mrt);
    this.ShowTable = false;
    this.ajaxService.getMethod({ schoolId: this.User.schoolId, fromUserId: this.User._id, fromUserType: 'teacher', month: mltc }, 'api/teacher/getteacherevent').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.calEvents = this.resdata.data.teacherevent;
        this.events = [];
        this.calEvents.forEach(element => {
          this.events.push({
            start: new Date(element.eventStarttime),
            end: new Date(element.eventEndtime),
            title: element.eventTopic,
            color: colors.red
          });
        });
      }
    });
  }

  changeSubject(id) {
    this.dataService.subjectId = id;
  }

  dayClicked(val) {
    console.log(val)
    this.EventList = [];
    val.events.forEach(element => {
      if (this.EventList.indexOf(element) == -1) {
        this.EventList.push(element);
      }
    });
    this.ShowTable = true;
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


  /**
 * Common function for Date object to date string like 20181212 (2018/12/12)
 * @param date object
 * @return string
 */
  dateToStr(dt) {
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

  saveEvent() {
    this.submitted = true;
    if (this.termForm.invalid) {
      return;
    }
    var lst = $("#start").val();

    var startTime = this.formatDate(new Date(lst)) + 'T' + this.ConvertTimeformat(24, this.termForm.value['eventStarttime']) + '.000Z';
    var endTime = this.formatDate(new Date(lst)) + 'T' + this.ConvertTimeformat(24, this.termForm.value['eventEndtime']) + '.000Z';
    this.termForm.value.eventStarttime = startTime;
    this.termForm.value.eventEndtime = endTime;
    this.termForm.value.eventDate = this.formatDate(new Date(lst)) + 'T' + '00:00:00.000Z';
    var gTeacher = '';
    var tCount = this.termForm.value.guestteacher.length;
    this.termForm.value.guestteacher.forEach(function (element, ind) {
      if (tCount - 1 == ind)
        gTeacher += element._id;
      else
        gTeacher += element._id + ',';
    });
    this.termForm.value.guestteacher = gTeacher;
    var clsArrayD = []; var cl = this.classes;
    this.termForm.value.guestClass.forEach(function (element1, ind1) {
      clsArrayD.push({ 'class_id': cl[ind1].classId, 'stream': cl[ind1].streamId })
    });
    this.termForm.value.guestClass = JSON.stringify(clsArrayD);
    console.log(this.termForm.value);
    this.ajaxService.postMethod('api/teacher/addteacherevent', this.termForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.submitted = false;
          this.termForm.reset(
            {
              fromName: this.User.teacherName,
              fromImage: this.User.teacherImage,
              schoolId: this.User.teacherSchool,
              teacherId: this.User._id
            });
          this.getTeacherEvents(new Date());
          this.closeModal();
        }
      });
  }

  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  formatDate(today) {
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }

  ConvertTimeformat(format, str) {
    var time = str;
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "pm" && hours < 12) hours = hours + 12;
    if (AMPM == "am" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return sHours + ":" + sMinutes + ":00";
  }

}
