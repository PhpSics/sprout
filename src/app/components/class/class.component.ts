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
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  User: any = {};
  subjectForm: FormGroup;
  resdata: any = {};
  schoolId: any  ='';
  class:any = [];
  streams:any = [];
  submitted = false;
  disabled:boolean=false;
  errorMessage: any = '';
  model:any = {};
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder) {
    }

  ngOnInit() {
    console.log(this.dataService.showStream)
    if (this.dataService.showStream == undefined || this.dataService.showStream == '') {
      this.dataService.showStream='';
      this.dataService.showClass='';
      this.disabled = true;
    }
    this.User = this.local.getData('AdminloginData');
    this.subjectForm = this.formBuilder.group({
      subjectName: ['', [Validators.required]],
      schoolId: [this.User.schoolId],
    });
    this.schoolId = this.User.schoolId;
    this.model = {
      classId:this.dataService.showClass,
      streamId:this.dataService.showStream,
    };
    if(this.dataService.showClass!=undefined && this.dataService.showClass!=''){
      this.changeClass(this.dataService.showClass,true);
    }
    this.getClass();
    this.getClass();
  }

  get f() { return this.subjectForm.controls; }

  getClass(){
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class').subscribe((val) => {
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

  changeClass(id,change=false) {
    console.log(id)
    this.dataService.showClass = id;
    if(!change){
      this.dataService.showStream = '';
      this.disabled = true;
    }
    this.ajaxService.getMethod({ classId: id }, 'api/class/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.streams = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeStream(id){
    console.log(id)
    this.dataService.showStream = id;
    if(id!='')
      this.disabled = false;
  }

}
