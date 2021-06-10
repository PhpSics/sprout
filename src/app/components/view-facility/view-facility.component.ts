import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-view-facility',
  templateUrl: './view-facility.component.html',
  styleUrls: ['./view-facility.component.css']
})
export class ViewFacilityComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  resdata: any = {};
  User: any = {};
  facilities: any = [];
  catForm: FormGroup;
  submitted = false;
  errorMessage: any = '';
  schoolId: any  ='';
  facilityId: string = '';
  facName: any = '';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService
    , private router: Router,public dialog: MatDialog,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.facilityId = this.dataService.showTour;
    this.facName = this.dataService.showCatName;
    this.User = this.local.getData('AdminloginData');
    this.catForm = this.formBuilder.group({
      facilityName: ['', [Validators.required]],
      schoolId: [this.User.schoolId],
      facilityLocation: [''],
      facilityCatagoryId: [this.facilityId],
      facilityCapacity: ['',[ Validators.pattern("^[0-9]*$")]],
      others: ['']
    });
    this.schoolId = this.User.schoolId;
    if (this.dataService.showTour == undefined) {
      this.router.navigate(['/facility']);
    } else
      this.getFacilities();
  }

  get f() { return this.catForm.controls; }

  getFacilities() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId, catagoryId: this.dataService.showTour }, 'api/school/facility').subscribe((val) => {
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

  openDialog(fname,fid): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(fname=='delete')
          this.deleteFacility(fid);
        // DO SOMETHING
      }
    });
  }

  deleteFacility(facilityId) {
    this.ajaxService.getMethod({ facilityId: facilityId }, 'api/school/deleteFacility').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.getFacilities();
      } else {
      }
    }, err => {

      console.log(err);
    });
  }

  savefacility() {
    this.submitted = true;
    if (this.catForm.invalid) {
      return;
    }
    this.ajaxService.postMethod('api/school/facility', this.catForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.catForm.reset({schoolId:this.User.schoolId,facilityCatagoryId:this.facilityId});
          this.submitted = false;
          this.getFacilities();
          this.closeModal();
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
