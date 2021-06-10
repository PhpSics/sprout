import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  User: any = {};
  subjectForm: FormGroup;
  resdata: any = {};
  schoolId: any  ='';
  subjects:any = [];
  submitted = false;
  errorMessage: any = '';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.subjectForm = this.formBuilder.group({
      subjectName: ['', [Validators.required]],
      schoolId: [this.User.schoolId],
    });
    this.schoolId = this.User.schoolId;
    this.getSubjects();
  }

  get f() { return this.subjectForm.controls; }

  getSubjects(){
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/subject/').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.subjects = this.resdata.data;
        // console.log(this.subjects);
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
          this.deleteSubject(fid);
        // DO SOMETHING
      }
    });
  }

  deleteSubject(id){
    this.ajaxService.getMethod({ subjectId: id }, 'api/subject/delete').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.getSubjects();
      } else {
      }
    }, err => {

      console.log(err);
    });
  }

  saveSubject() {
    this.submitted = true;
    if (this.subjectForm.invalid) {
      return;
    }
    this.ajaxService.postMethod('api/subject/', this.subjectForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.subjectForm.reset({ schoolId: this.User.schoolId });
          this.submitted = false;
          this.getSubjects();
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
}
