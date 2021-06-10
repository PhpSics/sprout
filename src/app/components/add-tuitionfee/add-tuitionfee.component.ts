import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-tuitionfee',
  templateUrl: './add-tuitionfee.component.html',
  styleUrls: ['./add-tuitionfee.component.css']
})
export class AddTuitionfeeComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  resdata:any = {};
  fees:any = [];
  User:any = {};
  termId = '';
  classId = '';
  streamId ='';
  classIds = '';
  streamIds ='';
  submitted = false; 
  feeForm: FormGroup;
  errorMessage: any = '';
  schoolId:any = '';
  classType:any = '';
  termName:any = '';
  className:any = '';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,private dataService: DataService,
    private router: Router,public dialog: MatDialog,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.termId = this.dataService.showTerm;
    this.classId = this.dataService.showClass;
    this.streamId = this.dataService.showStream;
    this.termName = this.dataService.showTermName;
    this.className = this.dataService.showcName;
    this.User = this.local.getData('AdminloginData');
    if(this.classId=='All Class'){
      this.classType = 'all';
      this.classIds = '';
      this.streamIds = '';
    }else{
      this.classIds = this.classId;
      this.streamIds = this.streamId;
      this.classType = '';
    }
    this.feeForm = this.formBuilder.group({
      feeName: ['', [Validators.required]],
      amount: ['',[Validators.required, Validators.pattern(/^[.\d]+$/)]],
      schoolId: [this.User.schoolId,[Validators.required]],
      adminId: [this.User._id,[Validators.required]],
      termId: [this.termId,[Validators.required]],
      classId: [this.classIds],
      streamId: [this.streamIds],
      classType: [this.classType],
      fromName: [this.User.userName],
      fromImage: [this.User.userImage],
      termName: [this.dataService.showTermName],
      FromdtStr: [this.dataService.showfdt],
      TodtStr: [this.dataService.showtdt]
    });
    this.getFees();
  }

  get f() { return this.feeForm.controls; }

  getFees(){
    this.ajaxService.getMethod({ schoolId: this.User.schoolId,termId:this.dataService.showTerm,classId:this.classId,streamId:this.streamId }, 'api/fees/list-tution-fee').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.fees = this.resdata.data;
        // console.log(this.fees);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  openDialog(fname,fid): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(fname=='delete')
          this.deleteFee(fid);
        // DO SOMETHING
      }
    });
  }

  deleteFee(feeId) {
    this.ajaxService.getMethod({ feeId: feeId }, 'api/fees/delete-fee').subscribe((val) => {
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
    this.ajaxService.postMethod('api/fees/add-tution-fee', this.feeForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.feeForm.reset({ schoolId: this.User.schoolId,
            adminId:this.User._id,
            termId:this.termId,
            classId:this.classIds,
            streamId:this.streamIds,
            classType:this.classType,
            fromName:this.User.userName,
            fromImage:this.User.userImage,
            termName:this.dataService.showTermName,
            FromdtStr:this.dataService.showfdt,
            TodtStr:this.dataService.showtdt});
          this.submitted = false;
          this.getFees();
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

  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

}
