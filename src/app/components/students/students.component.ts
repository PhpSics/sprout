import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  @ViewChild('ec') ec: ElementRef;
  @ViewChild('closeBtns') closeBtns: ElementRef;
  show: boolean = false;
  @ViewChild(NgForm) myForm: NgForm
  showFirst: boolean = true;
  showSecond: boolean = false;
  showThird: boolean = false;
  message = '';
  User: any = {};
  resdata: any = {};
  schoolId: any = '';
  students: any = [];
  submitted = false;
  errorMessage: any = '';
  classes: any = [];
  classId: any = '';
  streamId: any = '';
  Url: any = environment.baseUrl;
  streams: any = [];
  Cstreams: any = [];
  studentAge = 0;
  model: any = {};
  editimgURL: any = 'assets/images/user-default.png';
  searchText:any='';
  maxYear = new Date();
  formData:any;
  resdata1: any = [];
  countryCode:any = 'in';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private http: HttpClient,
    private router: Router, private el: ElementRef,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.maxYear.setFullYear(this.maxYear.getFullYear() - 2);
    this.maxYear = this.stringToDate(('31') + '/' + ('01') + '/' + (this.maxYear.getFullYear()));
    this.model = {
      entryLevel: "",
      studentClass: "",
      studentStream: "",
      EmergencyContact: [],
      studentSchool: this.User.schoolId,
      Contact: [{
        id: Date.now(),
        fname: "",
        lname: "",
        mobile: "",
        inum: "",
        paddress: ""
      }],
      studAllergies1: [],
      studAllergies: "",
      studMedication1: [],
      studMedication: "",
      AdditionalData: [],
      studentAge: this.studentAge,
      streetName:'',
      poBox:'',
      estate:'',
      town:'',
      htel:''
    }
    this.getStudents();
    this.getClass();
    this.getCountryCode();
  }

  getCountryCode(){
    this.ajaxService.getDirectMethod({}, "http://ip-api.com/json").subscribe((val) => {
      this.resdata = val;
      this.countryCode = this.resdata.countryCode.toLowerCase();
      console.log(this.countryCode)
    }, err => {
      console.log(err);
    });
  }

  calculate_age(dob) {
    var dob1 = this.stringToDate_new(dob);
    var diff_ms = Date.now() - dob1.getTime();
    var age_dt = new Date(diff_ms);
    this.studentAge = Math.abs(age_dt.getUTCFullYear() - 1970);
    this.model.studentAge = this.studentAge+" years old";
  }

  stringToDate(dateString) {
    const [dd, mm, yyyy] = dateString.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  stringToDate_new(dateString) {
    const [mm, dd, yyyy] = dateString.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  addStudent(showval) {
    this.show = showval;
  }

  changeStream(id) {
    this.streamId = id;
    this.getStudents();
  }

  add(val, ind = '') {
    if (val == 'contact') {
      this.model.EmergencyContact.push({
        id: Date.now(),
        name: "",
        email: "",
        relation: "",
        number: ""
      });
    }
    if (val == 'pcontact') {
      this.model.Contact.push({
        id: Date.now(),
        fname: "",
        lname: "",
        mobile: "",
        inum: "",
        paddress: ""
      });
    }
    if (val == 'allergy') {
      this.model.studAllergies1.push({
        id: Date.now(),
        name: ""
      })
    }
    if (val == 'medication') {
      this.model.studMedication1.push({
        id: Date.now(),
        name: ""
      })
    }
    if (val == 'aData') {
      this.model.AdditionalData.push({
        id: Date.now(),
        additioinalInfoName: "",
        additionalInfoValue: ""
      })
    }
  }

  back(val) {
    if (val == 3) {
      this.showThird = false;
      this.showSecond = true;
    }
    if (val == 2) {
      this.showSecond = false;
      this.showFirst = true;
    }
  }

  remove(val, id, v = '') {
    if (val == 'contact') {
      this.model.EmergencyContact.splice(id, 1);
    }
    if (val == 'pcontact') {
      this.model.Contact.splice(id, 1);
    }
    if (val == 'allergy') {
      this.model.studAllergies1.splice(id, 1);
    }
    if (val == 'medication') {
      this.model.studMedication1.splice(id, 1);
    }
    if (val == 'aData') {
      this.model.AdditionalData.splice(id, 1);
    }
  }

  onSecondSubmit() {
    this.showSecond = false;
    this.showThird = true;
  }

  changeClass(id) {
    this.classId = id;
    this.streamId = '';
    this.ajaxService.getMethod({ classId: id }, 'api/class/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.streams = this.resdata.data;
        this.getStudents();
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  changeClassStream(id) {
    this.ajaxService.getMethod({ classId: id }, 'api/class/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.Cstreams = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  getClass() {
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.classes = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  viewProfile(id, name, image, classN,std) {
    console.log(std)
    this.dataService.studentId = id;
    this.dataService.studentName = name;
    this.dataService.studentImage = image;
    this.dataService.studentClass = classN; 
    this.dataService.studArray = std;
    this.router.navigate(['/student-profile']);
  }

  getStudents() {
    this.ajaxService.getMethod({ school: this.User.schoolId, class: this.classId, stream: this.streamId }, 'api/student').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.students = this.resdata.data;
        //  console.log(this.students);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  onSubmit() {
    this.formData = new FormData;
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#editphoto');
    let fileCount: number = inputEl.files.length;
    if (fileCount > 0) {
      this.formData.append('image', inputEl.files.item(0));
    }
    this.showFirst = false;
    this.showSecond = true;
  }

  onThirdSubmit() {
    let inputEl1: HTMLInputElement = this.el.nativeElement.querySelector('#attachment');
    let fileCount1: number = inputEl1.files.length;
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');
    var self = this.model; var m = true; var l = ''; var md = ''; var fself = this.formData;
    Object.keys(this.model).forEach((k, indf) => {
      if (k == 'studentDob') {
        self['studentDob'] = this.datePipe.transform(this.model[k], 'dd/MM/yyyy');
      }
      if (k == 'dateofApplication') {
        if(this.model[k]!='')
          self['dateofApplication'] = this.datePipe.transform(this.model[k], 'dd/MM/yyyy');
        else self['dateofApplication'] = '';
      }
      if ((k == 'studAllergies1' || k == 'studAllergies') && m) {
        m = false;
        self['studAllergies1'].forEach(function (element, i) {
          if (i == 0)
            l = element.name;
          else l = l + ',' + element.name;
          self.studAllergies = l;
        });
        fself.append('studAllergies', l);
        self['studMedication1'].forEach(function (element1, j) {
          if (j == 0)
            md = element1.name;
          else md = md + ',' + element1.name;
        });
        fself.append('studMedication', md);
      }
      if (k == 'Contact') {
        var u = 1;
        self['Contact'].forEach(function (el, j) {
          fself.append('p' + u + 'fname', el.fname);
          fself.append('p' + u + 'lname', el.lname);
          fself.append('p' + u + 'mobile', el.mobile.replace(/\+/g, ''));
          fself.append('p' + u + 'identificationNo', el.inum);
          fself.append('p' + u + 'address', el.paddress);
          self['p' + u + 'fname'] = el.fname;
          self['p' + u + 'lname'] = el.lname;
          self['p' + u + 'mobile'] = el.mobile.replace(/\+/g, '');
          self['p' + u + 'identificationNo'] = el.inum;
          self['p' + u + 'address'] = el.paddress;
          u++;
        })
      }
      if (k != 'Contact' && k != 'studAllergies1' && k != 'studAllergies' && k != 'studMedication' && k != 'studMedication1' && k != 'sImg' && k!='residentialAddr') {
        if (k == 'AdditionalData' || k == 'EmergencyContact')
          this.formData.append(k, JSON.stringify(this.model[k]));
        else
          this.formData.append(k, this.model[k]);
      }
    });
    var addrData = '';
    if (this.model['streetName'] != '')
      addrData = addrData + this.model['streetName'];
    if (this.model['poBox'] != '')
      addrData = addrData + ',' + this.model['poBox'];
    if (this.model['estate'] != '')
      addrData = addrData + ',' + this.model['estate'];
    if (this.model['town'] != '')
      addrData = addrData + ',' + this.model['town'];
    if (this.model['htel'] != '')
      addrData = addrData + ',' + this.model['htel'];
    this.model['residentialAddr'] = addrData;
    this.formData.append('residentialAddr', addrData);
    if (fileCount1 > 0) {
      this.formData.append('Attachment', inputEl1.files.item(0));
    }
    console.log(this.formData);
    this.http.post(this.Url + 'api/student', this.formData, { headers: headers }).subscribe((val) => {
      this.resdata1 = val;
      if (this.resdata1.status == true) {
        this.submitted = false;
        this.showFirst = true;
        this.showSecond = false;
        this.showThird = false;
        this.studentAge = 0;
        this.getStudents();
        this.closeModals();
        this.refreshData();
      }
    }, err => {
      console.log(err);
    });
  }

  refreshData() {
    this.model = {
      entryLevel: "",
      studentClass: "",
      studentStream: "",
      EmergencyContact: [],
      studentSchool: this.User.schoolId,
      Contact: [{
        id: Date.now(),
        fname: "",
        lname: "",
        email: "",
        relation: "",
        paddress: ""
      }],
      studAllergies1: [],
      studAllergies: "",
      studMedication1: [],
      studMedication: "",
      AdditionalData: [],
      studentAge: this.studentAge,
      streetName:'',
      poBox:'',
      estate:'',
      town:'',
      htel:''
    };
    this.myForm.resetForm(this.model); 
  }

  //call this wherever you want to close modal
  private closeModals(): void {
    this.closeBtns.nativeElement.click();
  }


  preview(files, source = '') {
    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      if (source != '')
        this.editimgURL = reader.result;
    }
  }
}
