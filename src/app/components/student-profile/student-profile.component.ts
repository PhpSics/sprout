import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  student:any = {};
  Url:any = environment.baseUrl;
  defImgSrc:any = environment.defaultUserImage;
  jsVal:boolean = true;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private router: Router) {
      if(JSON.stringify(this.dataService.studentData)==='{}'){
        this.router.navigate(['/students']);
        return;
      }
     }

  ngOnInit() {
    if(JSON.stringify(this.dataService.studentData)==='{}'){
      this.router.navigate(['/students']);
      return;
    }
    this.student=this.dataService.studentData;    
  }

}
