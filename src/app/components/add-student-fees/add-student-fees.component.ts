import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';
export interface State {
  flag: string;
  name: string;
  population: string;
}
@Component({
  selector: 'app-add-student-fees',
  templateUrl: './add-student-fees.component.html',
  styleUrls: ['./add-student-fees.component.css']
})
export class AddStudentFeesComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  stateCtrl = new FormControl();
  resdata: any = {};
  fees: any = [];
  User: any = {};
  termId = '';
  classId = '';
  streamId = '';
  classes: any = [];
  students: any = [];
  clsList: any = [];
  submitted = false;
  feeForm: FormGroup;
  errorMessage: any = '';
  schoolId: any = '';
  termName: any = '';
  studentSettings = {};
  studentList: any = [];
  studNames: any = [];
  studList: any = [];
  csName: any = '';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private router: Router, public dialog: MatDialog,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    if (this.dataService.showFee == undefined) {
      this.router.navigate(['/otherfee']);
    }
    this.studentSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'studentName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
    this.feeForm = this.formBuilder.group({
      classId: [''],
      streamId: [this.streamId],
      groupId: [this.dataService.showFee],
      studentId: [''],
      stateCtrl: [''],
      feeName: [this.dataService.showFeeName, [Validators.required]],
      amount: [this.dataService.showAmount, [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      schoolId: [this.User.schoolId, [Validators.required]],
      fromName: [this.User.userName],
      fromImage: [this.User.userImage],
      termName: [this.dataService.showTermName],
      termId: [this.dataService.termId],
      FromdtStr: [this.dataService.showfdt],
      TodtStr: [this.dataService.showtdt]
    });
    this.getFees();
    this.getClass();
  }

  get f() { return this.feeForm.controls; }

  getClass() {
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class/classtream').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.classes = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeClass(ev) {
    var streamvId = ev.target.options[ev.target.options.selectedIndex].getAttribute('data-streamId');
    var classvId = ev.target.value;
    this.streamId = streamvId;
    this.feeForm.controls.streamId.setValue(streamvId);
    this.csName = ev.target.options[ev.target.options.selectedIndex].text;
    this.ajaxService.getMethod({ school: this.User.schoolId, class: classvId, stream: streamvId }, 'api/student').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.students = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  searchStudent(stdname) {
    // console.log(stdname);
    this.ajaxService.getMethod({ studentName: stdname, schoolId: this.User.schoolId }, 'api/fees/search-student').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.studNames = this.resdata.data;
        // console.log(this.studNames);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  getFees() {
    this.ajaxService.getMethod({ groupId: this.dataService.showFee }, 'api/fees/list-students').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.fees = this.resdata.data;
        console.log(this.fees);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  openDialog(fname, fid, sId): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (fname == 'delete')
          this.deleteFee(fid, sId);
        // DO SOMETHING
      }
    });
  }

  deleteFee(feeId, studentId) {
    this.ajaxService.postMethod('api/fees/remove-student', { groupId: feeId, studentId: studentId }).subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.getFees();
      } else {
      }
    }, err => {

      console.log(err);
    });
  }

  saveFee() {
    this.submitted = true;
    if (this.feeForm.invalid) {
      return;
    }
    if (this.clsList.length == 0) {
      this.showAlert('Please select a student');
      return;
    }
    this.feeForm.value.classId = JSON.stringify(this.clsList);
    this.feeForm.value.studentId = this.studentList.toString();
    console.log(this.feeForm.value)
    this.ajaxService.postMethod('api/fees/adstdgroup', this.feeForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.clsList = [];
          this.studentList = [];
          this.studList = [];
          this.feeForm.reset({
            schoolId: this.User.schoolId,
            streamId: this.streamId,
            termName: this.dataService.showTermName,
            termId: this.dataService.termId,
            fromName: this.User.userName,
            fromImage: this.User.userImage,
            amount: this.dataService.showAmount,
            feeName: this.dataService.showFeeName,
            groupId: this.dataService.showFee,
            FromdtStr: this.dataService.showfdt,
            TodtStr: this.dataService.showtdt,
            classId: '',
            studentId: ''
          });
          this.submitted = false;
          this.getFees();
          this.closeModal();
          this.schoolId = this.User.schoolId;
          this.studentList = [];
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

  showAlert(message) {
    let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
      width: '350px',
      data: message
    });
    dialogRef1.afterClosed().subscribe(result => {
    });
  }

  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  onSelectAll(items: any, type) {
    items.forEach(element => {
      var index = this.studentList.indexOf(element._id);
      if (index == -1) {
        this.studentList.push(element._id);
        this.studList.push(element.studentName + '-' + this.csName);
        this.clsList.push({ classId: this.feeForm.controls.classId.value, streamId: this.feeForm.controls.streamId.value, studentId: element._id });
      }
    });
  }

  onItemSelect(items: any, type) {
    var index = this.studentList.indexOf(items._id);
    if (index == -1) {
      this.studentList.push(items._id);
      console.log(items);
      this.studList.push(items.studentName + '-' + this.csName);
      this.clsList.push({ classId: this.feeForm.controls.classId.value, streamId: this.feeForm.controls.streamId.value, studentId: items._id });
    }
  }

  onItemDeselect(items: any, type) {
    var index = this.studentList.indexOf(items._id);
    if (index > -1) {
      this.studentList.splice(index, 1);
      this.studList.splice(index, 1);
      this.clsList.splice(index, 1);
    }
  }

  onDeSelectAll(items: any, type) {
    this.studentList = [];
    this.studList = [];
    this.clsList = [];
  }

  clickMe(classId, streamId, studentId, studentName, className, streamName) {
    // console.log(classId)
    // console.log(streamId)
    // console.log(studentId)
    // this.feeForm.value.classId = classId;
    // this.feeForm.controls.streamId.setValue(streamId);
    // this.feeForm.controls.classId.setValue(classId);
    // this.feeForm.controls.studentId.setValue(studentName.split(','));
    var index = this.studentList.indexOf(studentId);
    if (index == -1) {
      this.studentList.push(studentId);
      this.feeForm.value.streamId = streamId;
      this.studList.push(studentName + '-' + className + ' ' + streamName);
      this.clsList.push({ classId: classId, streamId: streamId, studentId: studentId });
    }
    this.feeForm.controls.stateCtrl.setValue('');
  }
}
