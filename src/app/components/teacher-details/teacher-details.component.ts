import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-teacher-details',
  templateUrl: './teacher-details.component.html',
  styleUrls: ['./teacher-details.component.css']
})
export class TeacherDetailsComponent implements OnInit {
  User: any = {};
  resdata: any = {};
  teacherData:any =[];
  Url = environment.baseUrl;

  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,
    private dataService: DataService,
    private router: Router,private _location: Location) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    if(this.dataService.getTeacher=='' || this.dataService.getTeacher==undefined){
      this.router.navigate(['/edit-teacher']);
      return;
    }
    this.getTeacherDetails();
  }

  getTeacherDetails(){
    this.ajaxService.getMethod({teacherId:this.dataService.getTeacher}, 'api/teacher/getTeacherDetails').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.teacherData = this.resdata.data[0];
        //console.log(this.teacherData);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  backClicked() {
    this._location.back();
  }
}
