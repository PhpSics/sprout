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
  selector: 'app-teaching-staff',
  templateUrl: './teaching-staff.component.html',
  styleUrls: ['./teaching-staff.component.css']
})
export class TeachingStaffComponent implements OnInit {

  User: any = {};
  roleForm: FormGroup;
  resdata: any = {};
  roles: any = [];
  schoolId: any = '';
  submitted = false;
  searchText;
  errorMessage: any = '';
  disabled:boolean= true;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.roleForm = this.formBuilder.group({
      groupName: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
    });
    this.schoolId = this.User.schoolId;
    this.getRoles();
  }

  getRoles(){
    console.log('Hiii')
    this.ajaxService.getMethod({ schoolId: this.User.schoolId}, 'api/teacher/getteacherrole').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.roles = this.resdata.data;
        console.log(this.roles);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

}
