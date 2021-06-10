import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../../services/commonfunction.service';
import { LocalstorageService } from '../../../services/localstorage.service';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-student-homework',
  templateUrl: './student-homework.component.html',
  styleUrls: ['./student-homework.component.css']
})
export class StudentHomeworkComponent implements OnInit {
  User: any = {};
  resdata: any = {};
  studentName = '';
  studentImage = '';
  Url: any = environment.baseUrl;
  studentClass = '';
  homework:any = [];
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    console.log(this.User);
    if (this.dataService.studentId === undefined) {
      this.router.navigate(['/students']);
    } else {
      this.studentName = this.dataService.studentName;
      this.studentImage = this.dataService.studentImage;
      this.studentClass = this.dataService.studentClass;
      this.getHomeworks();
    }
  }

  getHomeworks(){
    this.ajaxService.getMethod({ studentId: this.dataService.studentId,classId:'',subject:'',
        month:'',signoff:0,fromUserId:'',fromUserType:'admin'
      }, 'api/homework/getHomework').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.homework = this.resdata.data;
        console.log(this.homework);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  viewHomework(i){
    this.dataService.setHwrkData = this.homework[i];
    this.router.navigate(['/view-homework']);
  }

}
