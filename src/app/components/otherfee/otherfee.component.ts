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
  selector: 'app-otherfee',
  templateUrl: './otherfee.component.html',
  styleUrls: ['./otherfee.component.css']
})
export class OtherfeeComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  User: any = {};
  feeForm: FormGroup;
  resdata: any = {};
  schoolId: any = '';
  fees: any = [];
  terms: any = [];
  submitted = false;
  termId = '';
  searchText;
  errorMessage: any = '';
  disabled:boolean= true;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.feeForm = this.formBuilder.group({
      groupName: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      schoolId: [this.User.schoolId, [Validators.required]],
      adminId: [this.User._id, [Validators.required]],
      termId: [this.termId, [Validators.required]]
    });
    this.schoolId = this.User.schoolId;
    this.getTerms();
    this.getFees();
  }

  showAlert(){
    let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
      width: '350px',
      data: "Please select term"
    });
    dialogRef1.afterClosed().subscribe(result => {
    });
  }

  getFees(val = '') {
    this.termId = '';
    if (val != '') {
      this.termId = val;
    }
    this.feeForm.controls.termId.setValue(val);
    this.ajaxService.getMethod({ schoolId: this.User.schoolId, termId: val }, 'api/fees/list-groups').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.fees = this.resdata.data;
        //  console.log(this.assessments);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  get f() { return this.feeForm.controls; }

  isDisabled(){
    return this.disabled;
  }

  changeTerm(val = '', ev) {
    this.termId = '';
    if (val != '') {
      this.termId = val;
      this.disabled = false;
    }
    else this.disabled = true;
    if (ev != '') {
      this.dataService.showfdt = ev.target.options[ev.target.options.selectedIndex].getAttribute('data-fstr');
      this.dataService.showtdt = ev.target.options[ev.target.options.selectedIndex].getAttribute('data-tstr');
      this.dataService.showTermName = ev.target.options[ev.target.options.selectedIndex].text;
    }
    this.feeForm.controls.termId.setValue(val);
    this.ajaxService.getMethod({ schoolId: this.User.schoolId, termId: val }, 'api/fees/list-groups').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.fees = this.resdata.data;
        //  console.log(this.assessments);
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

  openDialog(fname, fid): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (fname == 'delete')
          this.deleteFee(fid);
        // DO SOMETHING
      }
    });
  }

  deleteFee(id) {
    this.ajaxService.getMethod({ feeId: id }, 'api/fees/delete-fee').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.getFees(this.termId);
      } else {
        if (this.resdata.message == 'Students Exists') {
          let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
            width: '350px',
            data: "Student Fee Exists!"
          });
          dialogRef1.afterClosed().subscribe(result => {
          });
        }
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
    this.ajaxService.postMethod('api/fees/add-group', this.feeForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.feeForm.reset({ schoolId: this.User.schoolId, adminId: this.User._id, termId: this.termId });
          this.submitted = false;
          this.getFees(this.termId);
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

  showFee(id, name, amount,termName,fdt,tdt,termId) {
    this.dataService.showFee = id;
    this.dataService.showFeeName = name;
    this.dataService.showAmount = amount;
    this.dataService.showTermName = termName;
    this.dataService.showtdt = tdt;
    this.dataService.showfdt = fdt;
    this.dataService.termId = termId;
    this.router.navigate(['/add-student-fee']);
  }

}
