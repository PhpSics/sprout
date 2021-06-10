import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef,Output,EventEmitter } from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-setup-school-calendar',
  templateUrl: './setup-school-calendar.component.html',
  styleUrls: ['./setup-school-calendar.component.css']
})
export class SetupSchoolCalendarComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @Output() 
  dateChange:EventEmitter< MatDatepickerInputEvent< any>>;
  resdata: any = {};
  User: any = {};
  //today's date
  todaydate: Date = new Date();
  terms: any = [];
  termPost: any = {};
  submitted = false;
  errorMessage: any = '';
  termForm: FormGroup;
  duration: any = '';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.termForm = this.formBuilder.group({
      termName: ['', [Validators.required]],
      schoolId: [this.User.schoolId],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      duration: ['', [Validators.required]],
    });
    this.getTerms();
    //console.log(this.daysBetween(new Date('2019-01-01'),new Date('2019-01-10')));
  }
  
  calculateDuration(val,cnt){
    if($('#pick1').val()!='' && $('#pick2').val()!=''){
      var d = this.daysBetween(new Date($('#pick1').val()),new Date($('#pick2').val()));
      //$('#duration').val(d);
      this.termForm.controls.duration.setValue(d);
    }
    //console.log(val.value);
  }
  getTerms() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/fees/getterm').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.terms = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  get f() { return this.termForm.controls; }

  saveTerm() {
    this.submitted = true;
    if (this.termForm.invalid) {
      console.log('Hi')
      return;
    }
    this.termForm.value.fromDate = this.termForm.value.fromDate.toLocaleDateString();
    this.termForm.value.toDate = this.termForm.value.toDate.toLocaleDateString();
    this.ajaxService.postMethod('api/fees/addterm', this.termForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.termForm.reset({ schoolId: this.User.schoolId });
          this.submitted = false;
          this.getTerms();
          this.closeModal();
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

  //call this wherever you want to close modal
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  weeks_between(date1, date2) {
    // The number of milliseconds in one week
    var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);
    // Convert back to weeks and return hole weeks
    return Math.round(difference_ms / ONE_WEEK);
  }

  daysBetween(startDate,endDate) {
    //milliseconds
    var different = endDate.getTime() - startDate.getTime();
    var secondsInMilli = 1000;
    var minutesInMilli = secondsInMilli * 60;
    var hoursInMilli = minutesInMilli * 60;
    var daysInMilli = hoursInMilli * 24;
    var elapsedDays = different / daysInMilli;
    different = different % daysInMilli;
    var elapsedHours = different / hoursInMilli;
    different = different % hoursInMilli;
    var elapsedMinutes = different / minutesInMilli;
    different = different % minutesInMilli;
    var elapsedSeconds = different / secondsInMilli;
    var week = (elapsedDays / 7).toString();
    console.log(week);
    var arr = week.split(".");
    console.log(arr);
    if(arr.length==1){
      week = arr[0]+'.0';
      arr = week.split(".");
    }
    var intArr = [];
    intArr[0] = arr[0]; // 1
    intArr[1] = arr[1].substring(0, 1); // 9
    return intArr[0] + " weeks and " + intArr[1] + " days";
  }
}
