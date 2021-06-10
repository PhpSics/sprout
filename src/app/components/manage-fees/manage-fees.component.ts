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
  selector: 'app-manage-fees',
  templateUrl: './manage-fees.component.html',
  styleUrls: ['./manage-fees.component.css']
})
export class ManageFeesComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  User: any = {};
  subjectForm: FormGroup;
  resdata: any = {};
  schoolId: any  ='';
  class:any = [];
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
    this.getClass();
  }

  get f() { return this.subjectForm.controls; }

  getClass(){
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class/classtream').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.class = this.resdata.data;
        console.log(this.class);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

}
