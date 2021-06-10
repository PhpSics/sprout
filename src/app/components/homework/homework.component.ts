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
  show: boolean = false;
  User: any = {};
  classList: any = [];
  subjects: any = [];
  ClsList: any = [];
  classes: any = [];
  model: any = {};
  homeworkForm: FormGroup;
  submitted: any = false;
  Url: any = environment.baseUrl;
  resdata: any = {};
  roles: any = [];
  pList: any = [];
  pLists: any = [];
  permissionList: any = [];
  ps: any = 0;
  today:any = new Date();
  spinner = false;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private http: HttpClient, private formBuilder: FormBuilder,
    private router: Router, private el: ElementRef,
    private _snackBar: MatSnackBar,public dialog: MatDialog) { }

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
    this.homeworkForm = this.formBuilder.group({
      classId: [this.dataService.classId],
      streamId: [this.dataService.streamId],
      uploadDate: [this.today, [Validators.required]],
      fromImage: [this.User.teacherImage],
      subject: [this.dataService.subjectId],
      teacherId: [this.User._id],
      fromName: [this.User.teacherName],
      teacher: [this.User.teacherName],
      topic: ['', [Validators.required]],
      description: ['', [Validators.required]],
      homeworkdate: ['', [Validators.required]]
    });
    this.getPermission();
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
      this.homeworkForm.controls.classId.setValue(this.dataService.classId);
      this.homeworkForm.controls.streamId.setValue(this.dataService.streamId);
    } else {
      this.dataService.classId = '';
      this.dataService.streamId = '';
      this.dataService.roleId = '';
      this.dataService.clsIndex = '';
      this.subjects = [];
      this.homeworkForm.controls.classId.setValue(this.dataService.classId);
      this.homeworkForm.controls.streamId.setValue(this.dataService.streamId);
    }
    this.pList = [];
    this.pLists = [];
    this.getPermission();
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

  changeSubject(id) {
    this.dataService.subjectId = id;
    this.homeworkForm.controls.subject.setValue(this.dataService.subjectId);
  }

  get f() { return this.homeworkForm.controls; }

  saveHomework() {
    this.submitted = true;
    this.spinner = true;
    if (this.homeworkForm.controls.subject.value=='') {
      this.openSnackBar('Please choose subject','Close');
      return;
    }
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
      } else if (k == 'uploadDate') {
        formData.append(k, upDate)
      } else
        formData.append(k, this.homeworkForm.value[k]);
    })
    if (fileCount > 0) {
      formData.append('attachment', inputEl.files.item(0));
    }
    this.http.post(this.Url + 'api/homework/', formData, { headers: headers }).subscribe((val) => {
      this.homeworkForm.reset({
        classId: this.dataService.classId,
        streamId: this.dataService.streamId,
        fromImage: this.User.teacherImage,
        teacherId: this.User._id,
        teacher: this.User.teacherName,
        uploadDate:new Date(),
        fromName: this.User.teacherName,
        subject:this.dataService.subjectId
      });
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

  //call this wherever you want to close modal
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

}
