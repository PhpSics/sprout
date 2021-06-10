import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resdata:any = {};
  errorMessage:any = '';
  success:any =false;
  constructor(private route: ActivatedRoute,private ajaxService: CommonfunctionService) {
    this.route.params.subscribe(params => this.reset(params['type'],params['id']));
  }

  ngOnInit() {
  }

  reset(type,id){
    this.ajaxService.postMethod('api/settings/reset',{userType:type,phoneNo:id} ).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.success = true;
        } else {
          this.success = false;
          this.errorMessage = this.resdata.message;
        }
      }, err => {
          this.success = false;
          this.errorMessage = err;
        console.log(err);
      });
  }

}
