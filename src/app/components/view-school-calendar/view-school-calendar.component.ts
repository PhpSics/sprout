import { Subject } from "rxjs";
import { ChangeDetectionStrategy, ViewChild, TemplateRef,Component,OnInit } from "@angular/core";
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
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
import { environment } from 'src/environments/environment.prod';

const colors: any = {
  red: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  }
};

@Component({
  selector: 'app-view-school-calendar',
  templateUrl: './view-school-calendar.component.html',
  styleUrls: ['./view-school-calendar.component.css']
})
export class ViewSchoolCalendarComponent implements OnInit {
  @ViewChild("modalContent")
  modalContent: TemplateRef<any>;
  events: CalendarEvent[] = [];
  calEvents:any = [];
  refresh: Subject<any> = new Subject();
  view: CalendarView = CalendarView.Month;
  EventList: any = [];
  CalendarView = CalendarView;
  ShowTable: any = false;
  viewDate: Date = new Date();
  imgUrls: any = 'assets/images/add-image.jpg';
  Url:any = environment.baseUrl;
  message:any = '';
  eventmoreData:any = [];
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  User:any = {};
  resdata:any = {};
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.getAdminEvents('');
  }

  getAdminEvents(val){
    this.ShowTable = false;
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/school/adminevent').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.calEvents = this.resdata.data.AdminEvents;
        this.events =[];
        var events = this.events;
        this.calEvents.forEach(function(element,index){
          events.push({
            start: new Date(element.eventStarttime),
            end: new Date(element.eventEndtime),
            title: index,
            color: colors.blue
          });
        });
      }
    });
  }

  dayClicked(val) {
    this.EventList = [];
    val.events.forEach(element => {
      if (this.EventList.indexOf(element) == -1) {
        this.EventList.push(element);
      }
    });
    this.ShowTable = true;
  }

  getEvent(ind){
    this.eventmoreData = this.calEvents[ind];
  }

  
}
