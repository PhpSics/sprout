import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  @ViewChild('ec') ec: ElementRef;
  @ViewChild('closeBtns') closeBtns: ElementRef;
  @ViewChild(NgForm) myForm: NgForm;
  show: boolean = false;
  showFirst: boolean = true;
  showSecond: boolean = false;
  showThird: boolean = false;
  message = '';
  shows: boolean = false;
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
  sData: any = [];
  Cstreams: any = [];
  studentAge = 0;
  classDId: any = '';
  streamDId: any = '';
  model: any = {};
  models: any = {};
  editimgURL: any = 'assets/images/user-default.png';
  editimgURLs: any = 'assets/images/user-default.png';
  searchTxt;
  maxYear = new Date();
  formData = new FormData;
  resdata1: any = [];
  studentName: any = '';
  studentImage: any = '';
  studentClass: any = '';
  countryCode:any = 'in';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private http: HttpClient, public dialog: MatDialog,
    private router: Router, private el: ElementRef,
    private datePipe: DatePipe) { }

  ngOnInit() {
    if (this.dataService.studentId == undefined) {
      this.router.navigate(['/students']);
    } else {
      this.studentName = this.dataService.studentName;
      this.studentImage = this.dataService.studentImage;
      this.studentClass = this.dataService.studentClass;
    }
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
      streetName: '',
      poBox: '',
      estate: '',
      town: '',
      htel: ''
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
    this.model.studentAge = this.studentAge + " years old";
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
        paddress: "",
        readonly:false
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

  viewProfile(id, name, image, classN) {
    this.dataService.studentId = id;
    this.dataService.studentName = name;
    this.dataService.studentImage = image;
    this.dataService.studentClass = classN;
    this.router.navigate(['/student-profile']);
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  getStudentData(type1 = 0) {
    this.ajaxService.getMethod({ studentId: this.dataService.studentId }, 'api/student/getStudentDetails').subscribe(
      (val) => {
        this.resdata = val;
        if (this.resdata.status == true) {
          this.sData = this.resdata.data[0];
          if (this.sData.studentImage != '')
            this.editimgURLs = this.Url + this.sData.studentImage;
          if (type1 == 0) {
            this.classDId = this.sData.studentClass._id;
            this.streamDId = this.sData.studentStream._id;
            this.dataService.studentImage = this.sData.studentImage;
            this.dataService.studentName = this.sData.studentName;
            this.dataService.studentClass = this.sData.studentClass.className + ' ' + this.sData.studentStream.streamName;
            this.studentImage = this.sData.studentImage;
            this.studentName = this.sData.studentName;
            this.studentClass = this.sData.studentClass.className + ' ' + this.sData.studentStream.streamName;
          }
        } else {
          console.log('false');
        }
      }, err => {
        console.log(err);
      });
  }

  getStudents() {
    this.ajaxService.getMethod({ studentId: this.dataService.studentId }, 'api/student/getStudentDetails').subscribe(
      (val) => {
        this.resdata = val;
        if (this.resdata.status == true) {
          this.models = this.resdata.data[0];
          this.model = this.resdata.data[0];
          this.model.studentDob = this.stringToDate(this.model.studentDob);
          if (this.model.dateofApplication != 'null' && this.model.dateofApplication != '') {
            this.model.dateofApplication = this.stringToDate(this.model.dateofApplication);
          }
          else this.model.dateofApplication = '';
          this.model.studentClass = this.model.studentClass._id;
          this.changeClassStream(this.model.studentClass);
          this.model.studentStream = this.model.studentStream._id;
          var addrData1 = this.model.residentialAddr;
          if (addrData1.length > 0)
            this.model.streetName = addrData1[0];
          else this.model.streetName = '';
          if (addrData1.length > 1)
            this.model.poBox = addrData1[1];
          else this.model.poBox = '';
          if (addrData1.length > 2)
            this.model.estate = addrData1[2];
          else this.model.estate = '';
          if (addrData1.length > 3)
            this.model.town = addrData1[3];
          else this.model.town = '';
          if (addrData1.length > 4)
            this.model.htel = addrData1[4];
          else this.model.htel = '';
          this.model.Contact = [];
          if (this.model.parent1Id != null)
            this.model.Contact.push({
              id: Date.now(),
              fname: this.model.parent1Id.parentFirstName,
              lname: this.model.parent1Id.parentLastName,
              mobile: this.model.parent1Id.parentPhNum,
              inum: this.model.parent1Id.parentIdentificationNo,
              paddress: this.model.parent1Id.parentAddress,
              readonly:true
            });
          if (this.model.parent2Id != null)
            this.model.Contact.push({
              id: Date.now(),
              fname: this.model.parent2Id.parentFirstName,
              lname: this.model.parent2Id.parentLastName,
              mobile: this.model.parent2Id.parentPhNum,
              inum: this.model.parent2Id.parentIdentificationNo,
              paddress: this.model.parent2Id.parentAddress,
              readonly:true
            });
          if (this.model.parent3Id != null)
            this.model.Contact.push({
              id: Date.now(),
              fname: this.model.parent3Id.parentFirstName,
              lname: this.model.parent3Id.parentLastName,
              mobile: this.model.parent3Id.parentPhNum,
              inum: this.model.parent3Id.parentIdentificationNo,
              paddress: this.model.parent3Id.parentAddress,
              readonly:true
            });
          this.model.studAllergies1 = [];

          if (this.model.studAllergies.length > 0) {
            this.model.studAllergies.forEach(element => {
              this.model.studAllergies1.push({
                id: Date.now(),
                name: element
              })
            });
          }
          this.model.studMedication1 = [];
          if (this.model.studMedication.length > 0) {
            this.model.studMedication.forEach(element => {
              this.model.studMedication1.push({
                id: Date.now(),
                name: element
              })
            });
          }
          this.model.pstudentId = this.model._id;
          this.model.pClassId = this.model.studentClass;
          this.model.pStreamId = this.model.studentStream;
          if (this.model.studentImage != '')
            this.editimgURL = this.Url + this.model.studentImage;
          //  console.log(this.model);
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

  onSubmit() {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#editphoto');
    let fileCount: number = inputEl.files.length;
    if (fileCount > 0) {
      this.formData.append('image', inputEl.files.item(0));
    }
    this.showFirst = false;
    this.showSecond = true;
  }

  onThirdSubmit() {
    // console.log('third');
    let inputEl1: HTMLInputElement = this.el.nativeElement.querySelector('#attachment');
    let fileCount1: number = inputEl1.files.length;
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');
    var self = this.model; var m = true; var fself = this.formData;
    // console.log(self);
    Object.keys(this.model).forEach((k, indf) => {
      if (k == 'studentDob') {
        self['studentDob'] = this.datePipe.transform(this.model[k], 'dd/MM/yyyy');
      }
      if (k == 'dateofApplication') {
        if (this.model[k] != '') {
          self['dateofApplication'] = this.datePipe.transform(this.model[k], 'dd/MM/yyyy');
        }
        else {
          self['dateofApplication'] = '';
        }
      }
      if ((k == 'studAllergies1' || k == 'studAllergies') && m) {
        m = false; var l = ''; var md = '';
        if (self['studAllergies1'].length > 0) {
          self['studAllergies1'].forEach(function (element, i) {
            if (i == 0)
              l = element.name;
            else l = l + ',' + element.name;
            self.studAllergies = l;
          });
        }
        fself.append('studAllergies', l);
        if (self['studMedication1'].length > 0) {
          self['studMedication1'].forEach(function (element1, j) {
            if (j == 0)
              md = element1.name;
            else md = md + ',' + element1.name;
          });
        }
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
          self['p' + u + 'mobile'] = el.mobile;
          self['p' + u + 'identificationNo'] = el.inum;
          self['p' + u + 'address'] = el.paddress;
          u++;
        })
      }
      if (k != 'Contact' && k != 'studAllergies1' && k != 'studAllergies' && k != 'studMedication1' && k != 'studMedication' && k != 'sImg' && k != 'parent2Id' && k != 'parent1Id' && k != 'parent3Id' && k!='residentialAddr') {
        if (k == 'AdditionalData' || k == 'EmergencyContact')
          this.formData.append(k, JSON.stringify(this.model[k]));
        else
          this.formData.append(k, this.model[k]);
      }
    });
    var addrData = '';
    // console.log(this.model)
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
    this.http.post(this.Url + 'api/student/editStudent', this.formData, { headers: headers }).subscribe((val) => {
      this.resdata1 = val;
      if (this.resdata1.status == true) {
        this.getStudentData(0);
        this.submitted = false;
        this.formData = new FormData;
        this.closeModals();
        this.showFirst = true;
        this.showSecond = false;
        this.showThird = false;
        this.studentAge = 0;
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
          streetName: '',
          poBox: '',
          estate: '',
          town: '',
          htel: ''
        }
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
      studentAge: this.studentAge
    }
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

  openDialog(fname): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (fname == 'delete')
          this.deleteStudent();
        // DO SOMETHING
      }
    });
  }

  deleteStudent() {
    this.ajaxService.getMethod({ studentId: this.dataService.studentId }, 'api/student/getStudentDetails').subscribe(
      (val) => {
        this.resdata = val;
        if (this.resdata.status == true) {
          this.sData = this.resdata.data[0];
          var classDIds = this.sData.studentClass._id;
          var streamDIds = this.sData.studentStream._id;
          this.ajaxService.getMethod({ studentId: this.dataService.studentId, classId: classDIds, streamId: streamDIds }, 'api/student/deleteStudent').subscribe((val) => {
            this.resdata = val;
            if (this.resdata.status == true) {
              this.router.navigate(['/students']);
            } else {
            }
          }, err => {

            console.log(err);
          });
        }
      }, err => {

        console.log(err);
      });
  }
}
