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
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  resdata: any = {};
  User: any = {};
  discounts: any = [];
  discountForm: FormGroup;
  submitted = false;
  errorMessage: any = '';
  schoolId: any = '';
  isAError: boolean = true;
  isPError: boolean = true;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.discountForm = this.formBuilder.group({
      discountName: ['', [Validators.required]],
      discountAmount: ['', [Validators.pattern(/^[.\d]+$/)]],
      discountPercent: ['', [Validators.pattern(/^[.\d]+$/)]],
      schoolId: [this.User.schoolId],
    });
    this.schoolId = this.User.schoolId;
    this.getDiscounts();
  }

  get f() { return this.discountForm.controls; }

  getDiscounts() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/fees/list-discount').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.discounts = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {

      console.log(err);
    });
  }

  deleteDiscount(discountId) {
    this.ajaxService.getMethod({ facilityId: discountId }, 'api/school/deleteFacilityCategory').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.getDiscounts();
      } else {
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
          this.deleteDiscount(fid);
        // DO SOMETHING
      }
    });
  }

  viewFacility(id, name) {
    this.dataService.showTour = id;
    this.dataService.showCatName = name;
    this.router.navigate(['/view-facility']);
  }

  saveDiscount() {
    this.submitted = true;
    // alert();
    console.log(this.discountForm.value);
    // return;
    if (this.discountForm.invalid) {
      return;
    }
    if (this.discountForm.value.discountAmount == '' && this.discountForm.value.discountPercent == '') {
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "Enter Discount Amount or Percentage."
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
      return;
    } else if (this.discountForm.value.discountAmount != '' && this.discountForm.value.discountPercent != '') {
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "Enter Discount Amount or Percentage."
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
      return;
    }
    this.ajaxService.postMethod('api/fees/add-discount', this.discountForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.discountForm.reset({
            schoolId: this.User.schoolId, discountName: '',
            discountAmount: '',
            discountPercent: ''
          });
          this.submitted = false;
          this.getDiscounts();
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
