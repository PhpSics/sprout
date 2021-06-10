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
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})

export class FacilityComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  resdata: any = {};
  User: any = {};
  facilities: any = [];
  catForm: FormGroup;
  submitted = false;
  errorMessage: any = '';
  schoolId: any  ='';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.catForm = this.formBuilder.group({
      catagoryName: ['', [Validators.required]],
      schoolId: [this.User.schoolId],
    });
    this.schoolId = this.User.schoolId;
    this.getFacilities();
  }

  get f() { return this.catForm.controls; }

  getFacilities() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/school/catagory').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.facilities = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {

      console.log(err);
    });
  }

  deleteFacility(facilityId) {
    this.ajaxService.getMethod({ facilityId: facilityId }, 'api/school/deleteFacilityCategory').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.getFacilities();
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
          this.deleteFacility(fid);
        // DO SOMETHING
      }
    });
  }

  viewFacility(id,name) {
    this.dataService.showTour = id;
    this.dataService.showCatName = name;
    this.router.navigate(['/view-facility']);
  }

  savefacility() {
    this.submitted = true;
    if (this.catForm.invalid) {
      return;
    }
    this.ajaxService.postMethod('api/school/catagory', this.catForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.catForm.reset({ schoolId: this.User.schoolId });
          this.submitted = false;
          this.getFacilities();
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
