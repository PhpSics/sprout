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
  submitted = false;
  forgotsubmitted = false;
  LoginType: any = 'parent';
  forgotForm:FormGroup;
  resdata: any = {};
  errorMessage: any = '';
  errorForgotMessage: any = '';
  successMessage:any  = '';
  constructor(private ajaxService: CommonfunctionService,
    private router: Router,
    private local: LocalstorageService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.forgotForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      userType: ['admin']
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
    this.ajaxService.postMethod('api/school/login', this.loginForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.local.storeData('AdminloginData', this.resdata.data);
          this.loginForm.reset();
          this.submitted = false;
          this.router.navigateByUrl('home');
          console.log(this.resdata)
        } else {
          this.errorMessage = this.resdata.message;
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
    this.ajaxService.postMethod('api/settings/resetPassword', this.forgotForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.successMessage = 'Please check your email to reset your password';
          this.forgotForm.reset({
            userType:'admin'
          });
          this.forgotsubmitted = false;
        } else {
          this.errorForgotMessage = this.resdata.message;
        }
      }, err => {
        this.errorForgotMessage = err;
        console.log(err);
      });
  }
}
