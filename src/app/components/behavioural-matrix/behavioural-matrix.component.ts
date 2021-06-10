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
  selector: 'app-behavioural-matrix',
  templateUrl: './behavioural-matrix.component.html',
  styleUrls: ['./behavioural-matrix.component.css']
})
export class BehaviouralMatrixComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  User: any = {};
  AssessmentForm: FormGroup;
  resdata: any = {};
  schoolId: any  ='';
  assessments:any = [];
  submitted = false;
  errorMessage: any = '';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.AssessmentForm = this.formBuilder.group({
      behaviourName: ['', [Validators.required]],
      markingScheme: [''],
      schoolId: [this.User.schoolId],
    });
    this.schoolId = this.User.schoolId;
    this.getAssessment();
  }

  get f() { return this.AssessmentForm.controls; }

  getAssessment(){
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/behaviour/').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.assessments = this.resdata.data;
        //  console.log(this.assessments);
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
          this.deleteAssessment(fid);
        // DO SOMETHING
      }
    });
  }

  deleteAssessment(id){
    this.ajaxService.getMethod({ assessmentId: id }, 'api/behaviour/deleteBehaviouralAssessment').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.getAssessment();
      } else {
      }
    }, err => {

      console.log(err);
    });
  }

  saveAssessment() {
    this.submitted = true;
    if (this.AssessmentForm.invalid) {
      return;
    }
    this.ajaxService.postMethod('api/behaviour', this.AssessmentForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.AssessmentForm.reset({ schoolId: this.User.schoolId });
          this.submitted = false;
          this.getAssessment();
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
