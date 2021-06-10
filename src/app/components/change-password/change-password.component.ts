import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { Location } from '@angular/common';
import { LocalstorageService } from '../../services/localstorage.service';
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  model: any = {};
  passwordError = '';
  User: any = {};
  resdata: any = {};
  errorMessage: any = '';
  successMessage: any = '';
  @ViewChild(NgForm) myForm: NgForm;
  submitted: boolean = false;
  constructor(private ajaxService: CommonfunctionService, private _location: Location, private local: LocalstorageService) { }

  ngOnInit() {
    this.User = this.local.getData('loginData');    
    this.model = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      userId: this.User._id,
      userType: 'teacher'
    }
  }

  navigateBack() {
    this._location.back();
  }

  onSubmit() {
    this.submitted = true;
    this.passwordError = '';
    this.successMessage = this.errorMessage = '';
    if (this.model.newPassword != this.model.confirmPassword) {
      this.passwordError = 'Password Mismatch'
      return;
    }
    this.ajaxService.postMethod('api/settings/changePassword', this.model).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.successMessage = 'Successfully Changed Your Password';
          this.model = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            userId: this.User._id,
            userType: 'teacher'
          }
          this.myForm.resetForm(this.model);
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

}
