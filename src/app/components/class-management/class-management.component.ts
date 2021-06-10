import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';

@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.css']
})
export class ClassManagementComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  User: any = {};
  classForm: FormGroup;
  resdata: any = {};
  schoolId: any = '';
  class: any = [];
  submitted = false;
  errorMessage: any = '';
  words2 = [];
  fcateg = [];
  searchText;
  behaviour = [];
  behaviours1: any = [];
  subjects1: any = [];
  fcategory: any = [];
  terms: any = [];
  subject = [];
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.classForm = this.formBuilder.group({
      className: ['', [Validators.required]],
      school: [this.User.schoolId],
      subjects: this.formBuilder.array([]),
      stream: this.formBuilder.array([]),
      term: ['', [Validators.required]],
      behaviours: this.formBuilder.array([]),
      facility: this.formBuilder.array([]),
      classTeacher: [''],
      subjectTeacher: ['']
    });
    this.schoolId = this.User.schoolId;
    this.getClass();
    this.getBehaviour();
    this.getSubject();
    this.getCategory();
    this.getTerms();
  }

  get f() { return this.classForm.controls; }

  getClass() {
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class/classtream').subscribe((val) => {
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

  getTerms() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/fees/getterm').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.terms = this.resdata.data;
        //console.log(this.terms);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  getBehaviour() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/behaviour').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.behaviours1 = this.resdata.data;
        //  console.log(this.behaviours);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  getSubject() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/subject').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.subjects1 = this.resdata.data;
        //  console.log(this.subjects);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  getCategory() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/school/catagory').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.fcategory = this.resdata.data;
        //  console.log(this.fcategory);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  openDialog(fname, fid): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (fname == 'delete')
          this.deleteClass(fid);
        // DO SOMETHING
      }
    });
  }

  openDialogs(fname, fid): void {
    if(fname=='delete'){
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "This class contains students"
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
    }else{
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "This stream is assigned to a teacher"
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
    }
    
  }

  deleteClass(id) {
    this.ajaxService.getMethod({ streamId: id }, 'api/class/deletestream').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        if(this.resdata.message=='This stream is assigned to a teacher'){
          this.openDialogs('d',1);
        }
        this.getClass();
      } else {
      }
    }, err => {

      console.log(err);
    });
  }

  add(val) {
    if (val == 'stream'){
      this.words2.push({ value: '' });
      this.stream.push(this.formBuilder.control(''));
    }
    else if (val == 'fcat')
      this.fcateg.push(this.fcateg.length);
    else if (val == 'behaviour')
      this.behaviour.push(this.behaviour.length);
    else if (val == 'subject') {
      this.subject.push(this.subject.length);
    }
  }

  changeSubject(val, sub,index) {
    if (sub == 'subject'){
      this.subjects.removeAt(index);
      this.subjects.insert(index,this.formBuilder.control(val));
    }
    else if (sub == 'behaviour'){
      this.behaviours.removeAt(index);
      this.behaviours.insert(index,this.formBuilder.control(val));
    }
    else if (sub == 'facility'){
      this.facility.removeAt(index);
      this.facility.insert(index,this.formBuilder.control(val));
    }      
  }

  remove(val, id) {
    if (val == 'stream') {
      this.words2.splice(id, 1);
      this.stream.removeAt(id);
    }
    else if (val == 'fcat'){
      this.fcateg.splice(id, 1);
      this.facility.removeAt(id);
    }
    else if (val == 'behaviour'){
      this.behaviour.splice(id, 1);
      this.behaviours.removeAt(id);
    }
    else if (val == 'subject') {
      this.subject.splice(id, 1);
      this.subjects.removeAt(id);
    }
  }

  saveClass() {
    this.submitted = true;
    if (this.classForm.invalid) {
      return;
     }
    
    if(this.classForm.value.subjects.length>0)
      this.classForm.value.subjects = this.classForm.value.subjects.join();
    else
      this.classForm.value.subjects = '';
    if(this.classForm.value.behaviours.length>0)
      this.classForm.value.behaviours = this.classForm.value.behaviours.join();
    else
      this.classForm.value.behaviours = '';
    if(this.classForm.value.facility.length>0)
      this.classForm.value.facility = this.classForm.value.facility.join();
    else
      this.classForm.value.facility = '';
    if(this.classForm.value.stream.length>0)
      this.classForm.value.stream = this.classForm.value.stream.join();
    else
      this.classForm.value.stream = '';
    this.ajaxService.postMethod('api/class', this.classForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.classForm.reset({ schoolId: this.User.schoolId });
          this.submitted = false;
          this.getClass();
          this.closeModal();
          this.schoolId = this.User.schoolId;
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

  get subjects() {
    return this.classForm.get('subjects') as FormArray;
  }

  get behaviours() {
    return this.classForm.get('behaviours') as FormArray;
  }

  get facility() {
    return this.classForm.get('facility') as FormArray;
  }

  get stream(): FormArray { return this.classForm.get('stream') as FormArray; }

}
