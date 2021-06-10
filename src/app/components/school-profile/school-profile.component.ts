import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-school-profile',
  templateUrl: './school-profile.component.html',
  styleUrls: ['./school-profile.component.css']
})
export class SchoolProfileComponent implements OnInit {
  jsVal: boolean = true;
  User: any = {};
  imgUrl: any = environment.defaultUserImage;
  Url: any = environment.baseUrl;
  message: any = '';
  public imagePath;
  resdata: any = {};
  msgForm: FormGroup;
  name:AbstractControl;
  address:AbstractControl;
  conNumber:AbstractControl;
  schoolCode:AbstractControl;
  UImage: any = '';
  resdatas: Object;
  getData: Object;
  constructor(private ajaxService: CommonfunctionService, private formBuilder: FormBuilder,
    private local: LocalstorageService, private http: HttpClient,
    private el: ElementRef, private router: Router) { }

  ngOnInit() {
    this.msgForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      conNumber: ['', [Validators.required]],
      schoolCode: ['', [Validators.required]],
    })
    console.log(this.msgForm.value)
    this.User = this.local.getData('AdminloginData');
    console.log(this.User)
    if(this.User.userImage!='')
      this.UImage = this.Url + this.User.userImage;
    this.jsVal = true;
  }
  editSchool(file){
    if (this.msgForm.invalid) {
      return;
    }
    var schoolId =this.User.schoolId
    var adminId = this.User._id
    var data = this.msgForm.value
   
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');
    this.http.post(this.Url + 'api/school/editAdmin', {data,schoolId,adminId}, { headers: headers }).subscribe((val) => {
       this.getData = val
       this.User = this.getData['data'];
      
      this.local.storeData('AdminloginData', this.getData["data"]);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/school-profile']);
     
    }, err => {
      console.log(err);
    });
  
  }
  preview(files) {
    console.log(files)
    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.UImage = reader.result;
    }
    var formData = new FormData();
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#my-file');
    let fileCount: number = inputEl.files.length;
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');
    formData.append('userImage', inputEl.files.item(0));
    formData.append('adminId', this.User._id);
    formData.append('oldPassword', '');
    console.log(formData)
    this.http.post(this.Url + 'api/school/updateAdmin', formData, { headers: headers }).subscribe((val) => {
      this.resdata = val;
      this.User = this.resdata.data;
      console.log(this.resdata.data)
      this.local.storeData('AdminloginData', this.resdata.data);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/school-profile']);
    }, err => {
      console.log(err);
    });
  }

}
