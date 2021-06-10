import { Component, OnInit,ChangeDetectionStrategy, ViewChild, TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
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
    primary: "#ad2121",
    secondary: "#FAE3E3"
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
  selector: 'app-behavioural-assessment',
  templateUrl: './behavioural-assessment.component.html',
  styleUrls: ['./behavioural-assessment.component.css']
})
export class BehaviouralAssessmentComponent implements OnInit {
  @ViewChild("modalContent")
  modalContent: TemplateRef<any>;

  events: CalendarEvent[] = [];

  refresh: Subject<any> = new Subject();

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  constructor() { }

  ngOnInit() {
  }

}
