import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CommonfunctionService } from '../../../services/commonfunction.service';
import { LocalstorageService } from '../../../services/localstorage.service';

@Component({
  selector: 'app-view-homework',
  templateUrl: './view-homework.component.html',
  styleUrls: ['./view-homework.component.css']
})
export class ViewHomeworkComponent implements OnInit {
  selHWork:any = {};
  resdata:any = {};
  comments:any = [];
  Url: any = environment.baseUrl;
  formatComments:any = [];
  ImgUrl = environment.defaultUserImage;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,private dataService: DataService,private router: Router) { }

  ngOnInit() {
    if (this.dataService.studentId === undefined) {
      this.router.navigate(['/students']);
    } else {
      console.log(this.dataService.setHwrkData);
      this.selHWork = this.dataService.setHwrkData;
      this.getAllComments();
    }
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  getAllComments(){
    this.ajaxService.getMethod({ homeworkMainId: this.selHWork._id,fromUserType:'admin' }, 'api/homework/homeworkcomment').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.comments = this.resdata.data;
        this.formatComment();
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  formatComment(){
    this.comments.forEach(element => {
      element.userImage = '';
      element.userName = '';
      if(element.userType =='parent'){
        element.userImage = element.studentId.studentImage;
        element.userName = element.studentId.studentName;
      }else if(element.userType =='teacher'){
        element.userImage = element.teacherId.teacherImage;
        element.userName = element.teacherId.teacherName;
      }else if(element.userType =='admin'){
        element.userImage = element.adminId.userImage;
        element.userName = element.adminId.userName;
      }
      console.log(element);
      console.log('hi');
      this.formatComments.push(element);
    });
  }

}
