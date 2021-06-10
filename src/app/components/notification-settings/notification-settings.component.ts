import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {
  resdata: any = {};
  User: any = {};
  notfnSettings: any = {};
  model: any = {};
  errorMessage: string = '';
  constructor(private ajaxService: CommonfunctionService, private local: LocalstorageService) { }

  ngOnInit() {
    this.User = this.local.getData('loginData');
    this.model = {
      userId: this.User._id,
      homeworkSettings: {
        "notificationTone" : 0,
        "vibrate" : 0,
        "popup" : 0,
        "light" : 0
      },
      eventSettings: {
        "notificationTone" : 0,
        "vibrate" : 0,
        "popup" : 0,
        "light" : 0
      },
      messageSettings: {
        "notificationTone" : 0,
        "vibrate" : 0,
        "popup" : 0,
        "light" : 0
      },
      userType:'teacher'
    };
    this.getNotificationSettings();
  }

  getNotificationSettings() {
    this.ajaxService.getMethod({ userId: this.User._id,userType:'teacher' }, 'api/settings/notification-settings').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.notfnSettings = this.resdata.data;
        this.model.homeworkSettings = this.notfnSettings.homeworkSettings[0];
        this.model.eventSettings = this.notfnSettings.eventSettings[0];
        this.model.messageSettings = this.notfnSettings.messageSettings[0];
        console.log(this.notfnSettings);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeValues(event) {    
    let smodel = {
      userId: this.User._id,
      homeworkSettings: {},
      eventSettings: {},
      messageSettings: {},
      userType:'teacher'
    };
    smodel.homeworkSettings = JSON.stringify(this.model.homeworkSettings);
    smodel.eventSettings = JSON.stringify(this.model.eventSettings);
    smodel.messageSettings = JSON.stringify(this.model.messageSettings);
    // console.log(this.model);
    this.ajaxService.postMethod('api/settings/notification-settings', smodel).subscribe(
      (res) => {
        this.resdata = res;
        // this.getNotificationSettings();
        if (this.resdata.status == true) {
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }
}
