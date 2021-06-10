import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  clickType: any = 'login';
  loginForm: FormGroup;
  forgotForm:FormGroup;
  submitted = false;
  LoginType: any = 'parent';
  resdata: any = {};
  errorMessage: any = '';
  countryCode: any = 'ke';
  forgotsubmitted = false;
  errorForgotMessage: any = '';
  successMessage:any  = '';
  constructor(private ajaxService: CommonfunctionService,
    private router: Router,
    private local: LocalstorageService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      phonenumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      deviceToken:['']
    });
    this.forgotForm = this.formBuilder.group({
      phoneNo: ['', [Validators.required]],
      userType: ['teacher']
    });
    this.getCountryCode();
  }

  getCountryCode() {
    this.ajaxService.getDirectMethod({}, 'http://ip-api.com/json').subscribe((val) => {
      this.resdata = val;
      this.countryCode = this.resdata.countryCode.toLowerCase();
      console.log(this.countryCode);
    }, err => {
      console.log(err);
    });
  }

  get f() { return this.loginForm.controls; }
  get g() { return this.forgotForm.controls; }

  changeView(event) {
    if (event == 1) {
      this.clickType = 'forgot';
    } else {
      this.clickType = 'login';
    }
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loginForm.value.phonenumber = this.loginForm.value.phonenumber.replace(/\+/g, '');
    this.ajaxService.postMethod('api/teacher/teacher-login', this.loginForm.value).subscribe(
      (res) => {
        this.resdata = res;
        console.log(this.resdata)
        if (this.resdata.status == true) {
          this.local.storeData('loginData', this.resdata.data);
          this.loginForm.reset();
          this.submitted = false;
          this.router.navigateByUrl('dashboard');
        } else {
          this.errorMessage = this.resdata.message;
          this.successMessage = '';

        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

  forgotPassword() {
    this.successMessage = '';
    this.errorForgotMessage = '';
    this.forgotsubmitted = true;
    if (this.forgotForm.invalid) {
      return;
    }
    this.forgotForm.value.phoneNo = this.forgotForm.value.phoneNo.replace(/\+/g, '');
    this.ajaxService.putUpMethod('api/settings/forgotPassword', this.forgotForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.successMessage = 'Your new password has been sent to your registered phonenumber';
          this.forgotForm.reset({
            userType:'teacher'
          });
          this.forgotsubmitted = false;
          this.changeView(0);
        } else {
          this.errorForgotMessage = this.resdata.message;
        }
      }, err => {
        this.errorForgotMessage = err;
        console.log(err);
      });
  }
}
