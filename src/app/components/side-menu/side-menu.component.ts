import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  homeMenu : any = ['/dashboard'];
  homeActive : boolean = false;
  planMenu : any = ['/teaching-plan'];
  planActive : boolean = false;
  stdMenu : any = ['/students'];
  stdActive : boolean = false;
  msgMenu : any = ['/messages'];
  msgActive : boolean = false;
  calMenu : any = ['/calendar'];
  calActive : boolean = false;
  atMenu : any = ['/attendance'];
  atActive : boolean = false;
  asMenu : any = ['/assessment','/behavioural-assessment','/extracurricular-assessment','/academic-assessment'];
  asActive : boolean = false;
  timeMenu : any = ['/timetable'];
  timeActive : boolean = false;
  hmMenu : any = ['/homework','/review-homework','/mark-homework','/setup-homework'];
  hmActive : boolean = false;
  lrMenu : any = ['/learning','/academic-progress','/behavioural-progress','/extracurricular-progress',
                  '/view-academic-progress','/view-behavioural-progress','/view-extracurricular-progress'];
  lrActive : boolean = false;
  route_url : any = '';
  User:any = {};
  resdata:any = {};
  messageCount:any;
  showMe:boolean = true;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,router: Router) {
    router.events.subscribe((url:any) =>'');
    this.route_url = router.url;
    if (this.homeMenu.includes(this.route_url)) {
      this.homeActive = true;
    }
    if (this.stdMenu.includes(this.route_url)) {
      this.stdActive = true;
    }
    if (this.msgMenu.includes(this.route_url)) {
      this.msgActive = true;
    }
    if (this.atMenu.includes(this.route_url)) {
      this.atActive = true;
    }
    if (this.asMenu.includes(this.route_url)) {
      this.asActive = true;
    }
    if (this.calMenu.includes(this.route_url)) {
      this.calActive = true;
    }
    if (this.lrMenu.includes(this.route_url)) {
      this.lrActive = true;
    }
    if (this.hmMenu.includes(this.route_url)) {
      this.hmActive = true;
    }
    if (this.timeMenu.includes(this.route_url)) {
      this.timeActive = true;
    }
    if (this.planMenu.includes(this.route_url)) {
      this.planActive = true;
    }
   }

  ngOnInit() {
    this.User = this.local.getData('loginData');
    this.getMessageCount();
  }
  getMessageCount() {
    this.ajaxService.getMethod({ teacherId: this.User._id}, 'api/notifications/notificationCount').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.messageCount = this.resdata.data.message;
        console.log(this.messageCount)
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  clickMe(){
    console.log('hey');
    this.showMe = !this.showMe;
  }
}
