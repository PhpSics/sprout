import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  User:any = {};
  resdata:any = {};
  messageCount:any;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.getMessageCount();
  }

  getMessageCount() {
    this.ajaxService.getMethod({ adminId: this.User._id,notificationType:'message' }, 'api/notifications/notificationCount').subscribe((val) => {
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

}
