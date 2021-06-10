import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';

declare var $: any;

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent implements OnInit {
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
  today:any = new Date();
  spinner = false;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private el: ElementRef, private dataService: DataService,public dialog: MatDialog) {
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
    this.classId = this.dataService.showClass;
    this.streamId = this.dataService.showStream;
    this.homeworkForm = this.formBuilder.group({
      classId: [this.dataService.showClass],
      streamId: [this.dataService.showStream],
      uploadDate: [this.today, [Validators.required]],
      fromImage: [this.User.userImage],
      subject: ['', [Validators.required]],
      adminId: [this.User._id],
      fromName: [this.User.userName],
      topic: ['', [Validators.required]],
      description: [''],
      homeworkdate: ['', [Validators.required]]
    });
    this.getClass();
    this.changeClass(this.classId);
    this.getSubjects();
  }

  get f() { return this.homeworkForm.controls; }

  saveHomework() {
    this.submitted = true;
    this.spinner = true;

    if (this.homeworkForm.invalid) {
      this.spinner = false;
      return;
    }
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#attachment');
    let fileCount: number = inputEl.files.length;
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');
    var lst = $("#homeworkdate").val();
    var startTime = this.formatDate(new Date(lst)) + 'T00:00:00' + '.000Z';
    var formData = new FormData();
    var upDate = this.changeDateFormat(new Date($('#uploadDate').val()));
    Object.keys(this.homeworkForm.value).forEach((k) => {
      if (k == 'homeworkdate') {
        formData.append(k, startTime)
      }else if(k =='uploadDate'){
        formData.append(k, upDate)
      } else
        formData.append(k, this.homeworkForm.value[k]);
    })
    if (fileCount > 0) {
      formData.append('attachment', inputEl.files.item(0));
    }
    this.http.post(this.Url + 'api/homework/', formData, { headers: headers }).subscribe((val) => {
      this.homeworkForm.reset({
        classId: this.dataService.showClass,
        streamId: this.dataService.showStream,
        fromImage: this.User.userImage,
        adminId: this.User._id,
        subject:'',
        uploadDate:new Date(),
        fromName: this.User.userName});
      this.submitted = false;
      this.spinner = false;
      this.closeModal();
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "Homework Sent."
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
    }, err => {
      console.log(err);
    });
  }

  //call this wherever you want to close modal
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
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeStream(id) {
    this.dataService.showStream = id;
  }

  getSubjects() {
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

}
