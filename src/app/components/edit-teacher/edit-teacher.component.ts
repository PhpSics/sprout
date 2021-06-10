import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css']
})
export class EditTeacherComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtns') closeBtns: ElementRef;  
  @ViewChild(NgForm) myForm: NgForm;
  show: boolean = false;
  User: any = {};
  roleForm: FormGroup;
  resdata: any = {};
  resdata1: any = {};
  roles: any = [];
  teachers: any = [];
  schoolId: any = '';
  submitted = false;
  searchText;
  errorMessage: any = '';
  disabled: boolean = true;
  Url = environment.baseUrl;
  model: any = {};
  editmodel: any = {};
  editmodels: any = {};
  words2: any = [];
  subjs: any = [];
  info: any = [];
  troles: any = [];
  scl: any = [];
  classes: any = [];
  streams: any = [];
  subjects: any = [];
  teacherData: any = [];
  public imagePath;
  countryCode:any = 'in';
  imgURL: any = 'assets/images/user-default.png';
  editimgURL: any = 'assets/images/user-default.png';
  message: any = '';
  teacherRoles: any = [];
  xVal: any = -1;
  maxYear = new Date();
  filterData: any = [];
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, public dialog: MatDialog,
    private dataService: DataService, private router: Router,
    private formBuilder: FormBuilder, private http: HttpClient,
    private datePipe: DatePipe, private el: ElementRef) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.maxYear.setFullYear( this.maxYear.getFullYear() - 18 );
    this.maxYear = this.stringToDate(('31') + '/' + ('12' ) + '/' + (this.maxYear.getFullYear()));
    this.model = {
      teacherSchool: this.User.schoolId,
      teacherExperience: [],
      additionalData: [],
      teacherRole1: [],
      teacherRole: [],
      endDate: '',
      teacherGender: '',
      teacherBirthCertNo: '',
      teacherPhone: '',
      teacherId: '',
      teacherUPI: '',
      teacherNationality: ''
    }
    this.editmodel = {
      teacherSchool: this.User.schoolId,
      teacherExperience: [],
      additionalData: [],
      teacherRole1: [],
      teacherRole: [],
      endDate: '',
      teacherGender: '',
      teacherBirthCertNo: '',
      teacherPhone: '',
      teacherId: '',
      teacherUPI: '',
      teacherNationality: ''
    }
    this.schoolId = this.User.schoolId;
    this.getTeachers();
    this.getClass();
    this.getSubject();
    this.getRoles();
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

  stringToDate(dateString) {
    const [dd, mm, yyyy] = dateString.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  getTeachers() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/teacher').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.teachers = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  addStudent(showval) {
    this.show = showval;
  }

  getX(){
    return this.xVal++;
  }

  viewTeacher(id) {
    this.dataService.getTeacher = id;
    this.router.navigate(['/teacher-details']);
  }

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  onEditSubmit(){
    console.log(this.editmodel.teacherRole1);
    // return;
    if (this.editmodel['teacherRole1'].length == 0) {
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "Please add Teacher Role Suject and Class!"
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
      return;
    } else if (this.editmodel['teacherRole1'][0].Role == '' || this.editmodel['teacherRole1'][0].additional.length == 0) {
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "Please add Teacher Role Suject and Class!"
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
      return;
    } else if (this.editmodel['teacherRole1'][0].additional.length != 0) {
      if (this.editmodel['teacherRole1'][0].additional[0]['Classs'] == '' || this.editmodel['teacherRole1'][0].additional[0]['Stream'] == '' || this.editmodel['teacherRole1'][0].additional[0]['Subject'] == '') {
        let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
          width: '350px',
          data: "Please add Teacher Role Suject and Class!"
        });
        dialogRef1.afterClosed().subscribe(result => {
        });
        return;
      }
    }
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#editphoto');
    let fileCount: number = inputEl.files.length;
    let inputEl1: HTMLInputElement = this.el.nativeElement.querySelector('#editcontract');
    let fileCount1: number = inputEl1.files.length;
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');
    var formData = new FormData();
    Object.keys(this.editmodel).forEach((k, indf) => {
      if (k == 'teacherExperience') {
        var d = this.editmodel[k];
        this.editmodel[k].forEach(element => {
          let m = '';
          var len = element.nameValuePairs.experience_Subjects.length;
          element.nameValuePairs.experienceStartDate = this.datePipe.transform(element.nameValuePairs.experienceStartDate, 'dd/MM/yyyy');
          element.nameValuePairs.experienceEndDate = this.datePipe.transform(element.nameValuePairs.experienceEndDate, 'dd/MM/yyyy');
          element.nameValuePairs.experience_Subjects.forEach(function (element1, index) {
            if (m == '')
              m = element1.subjects;
            else {
              if (element1.subjects != '') m = m + ',' + element1.subjects;
            }
            if (len - 1 == index) {
              element.nameValuePairs.experienceSubjects = m;
            }
          });
        });
      }
      if (k == 'teacherDob') {
        this.editmodel[k] = this.datePipe.transform(this.editmodel[k], 'dd/MM/yyyy');
      }
      if (k == 'startDate') {
        this.editmodel[k] = this.datePipe.transform(this.editmodel[k], 'dd/MM/yyyy');
      }
      if (k == 'teacherRole1' || k=='teacherRole') {
       var r = this.editmodel.teacherRole1[0]['Role']
       this.filterData = this.editmodel.teacherRole1[0]['additional']
     
        for (let i = 0; i < this.filterData.length; i++) {

             this.filterData[i].Role = r
        }
      
        this.editmodel['teacherRole'] = [];
        this.editmodel['teacherRole1'].forEach(element => {
          element.additional.forEach(element5 => {
            this.editmodel['teacherRole'].push(element5);
          });
          //return;
        });
      }
      if (k != 'teacherRole1' && k!='teacherPhone' && k!='password' && k!='Defpassword' && k!='deviceToken' && k!='createdAt' && k!='_id') {
        if (k == 'teacherRole' || k == 'teacherExperience' || k == 'additionalData'){
          console.log(JSON.stringify(this.editmodel[k]));
          formData.append(k, JSON.stringify(this.editmodel[k]));
        }
        else
          formData.append(k, this.editmodel[k]);
      }
    });
    //return;
    if (fileCount > 0) {
      formData.append('teacherImage', inputEl.files.item(0));
    }
    if (fileCount1 > 0) {
      formData.append('teacherContractFile', inputEl1.files.item(0));
    }
    console.log(this.editmodel);
    console.log(headers);
    //return;
    this.http.post(this.Url + 'api/teacher/editTeacher', formData, { headers: headers }).subscribe((val) => {
      this.submitted = false;      
      this.getTeachers();
      this.closeModals();
      this.editmodel = {
        teacherSchool: this.User.schoolId,
        teacherExperience: [],
        additionalData: [],
        teacherRole1: [],
        teacherRole: [],
        endDate: '',
        teacherGender: '',
        teacherBirthCertNo: '',
        teacherPhone: '',
        teacherId: '',
        teacherUPI: '',
        teacherNationality: ''
      }
      this.myForm.resetForm(this.editmodel);          
    }, err => {
      console.log(err);
    });
  }

  editTeacher(teacherId) {
    this.ajaxService.getMethod({ teacherId: teacherId }, 'api/teacher/getTeacherDetails').subscribe((val) => {
      this.resdata = val;
      this.editimgURL = 'assets/images/user-default.png';
      if (this.resdata.status == true) {
        this.teacherData = this.resdata.data[0];
        this.editmodel = {};
        this.editmodels = this.teacherData;
        this.editmodels.teacherPhone = this.editmodels.teacherPhone;
        this.editmodels.teacherDob = this.stringToDate(this.editmodels.teacherDob);
        this.editmodels.startDate = this.stringToDate(this.editmodels.startDate);
        this.editmodels.teacherPid = this.editmodels._id;
        this.editmodels.teacherSchool = this.User.schoolId;
        if(this.editmodels.teacherImage!='')
          this.editimgURL = this.Url+this.editmodels.teacherImage;
        // console.log(this.editmodels);
        var RoleTxt = ''; var z = -1; var tcRole = [];
        this.editmodels.teacherRole1 = [];
        var self = this.editmodels;
        var selfmtd = this;
        var r = 0;
        this.editmodels.additionalData.forEach(function (element, index) {
          self.additionalData[index].id = Date.now();
        });
        this.editmodels.teacherExperience.forEach(function (element, index) {
          // console.log(selfmtd.stringToDate(element.nameValuePairs.experienceStartDate));
          element.nameValuePairs.experienceStartDate = selfmtd.stringToDate(element.nameValuePairs.experienceStartDate);
          self.teacherExperience[index].nameValuePairs.experienceEndDate = selfmtd.stringToDate(element.nameValuePairs.experienceEndDate);
          element.nameValuePairs.experience_Subjects = [];
          var esub = element.nameValuePairs.experienceSubjects.split(',');
          if(esub.length>0){
            esub.forEach(etxt => {
              self.teacherExperience[index].nameValuePairs.experience_Subjects.push({
                id:Date.now(),            
                subjects:etxt
              });
            });
          
        }
        });
        this.editmodels.teacherRole.forEach(function (element, index) {
          if (RoleTxt != element.Role._id) {
            self.teacherRole1.push({
              id: Date.now(),
              Role: element.Role._id,
              additional: []
            });
            z++;
            //  console.log(element.teacherRole1);
          }
          self.teacherRole1[z].additional.push({
            id: Date.now(),
            Role: element.Role._id,
            Classs: element.Classs._id,
            Stream: element.Stream._id,
            Subject: element.Subject._id,
            cnt:r
          });
          selfmtd.changeClass(element.Classs._id, r);
          RoleTxt = element.Role._id;
          r++;
        });
        this.editmodel = self;
        console.log(self)
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  add(val, ind = '') {
    if (val == 'exp') {
      this.model.teacherExperience.push({
        "nameValuePairs": {
          id: Date.now(),
          institutionName: '', // <--- uniqueness hook.
          experienceStartDate: "",
          experienceEndDate: "",
          teachingLevel: "",
          experience_Subjects: [],
          experienceSubjects: ""

        }
      });
    }
    if (val == 'sub') {
      this.model.teacherExperience[ind].nameValuePairs.experience_Subjects.push({
        id: Date.now(),
        subjects: ""
      })
    }
    if (val == 'info') {
      this.model.additionalData.push({
        id: Date.now(),
        additioinalInfoName: "",
        additionalInfoValue: ""
      })
    }
    if (val == 'trole') {
      this.model.teacherRole1.push({
        id: Date.now(),
        Role: "",
        additional: []
      })
    }
    if (val == 'subj') {
      this.model.teacherRole1[ind].additional.push({
        id: Date.now(),
        Role: this.model.teacherRole1[ind].Role,
        Classs: "",
        Stream: "",
        Subject: "",
        cnt:this.getX()
      })
    }
  }

  addEdit(val, ind = '') {
    if (val == 'exp') {
      this.editmodel.teacherExperience.push({
        "nameValuePairs": {
          id: Date.now(),
          institutionName: '', // <--- uniqueness hook.
          experienceStartDate: "",
          experienceEndDate: "",
          teachingLevel: "",
          experience_Subjects: [],
          experienceSubjects: ""

        }
      });
    }
    if (val == 'sub') {
      this.editmodel.teacherExperience[ind].nameValuePairs.experience_Subjects.push({
        id: Date.now(),
        subjects: ""
      })
    }
    if (val == 'info') {
      this.editmodel.additionalData.push({
        id: Date.now(),
        additioinalInfoName: "",
        additionalInfoValue: ""
      })
    }
    if (val == 'trole') {
      this.editmodel.teacherRole1.push({
        id: Date.now(),
        Role: "",
        additional: []
      })
    }
    if (val == 'subj') {
      this.editmodel.teacherRole1[ind].additional.push({
        id: Date.now(),
        Role: this.editmodel.teacherRole1[ind].Role,
        Classs: "",
        Stream: "",
        Subject: "",
        cnt:this.getX()
      })
    }
  }

  remove(val, id, v = '') {
    if (val == 'exp') {
      this.model.teacherExperience.splice(id, 1);
    }
    if (val == 'sub') {
      this.model.teacherExperience[id].nameValuePairs.experience_Subjects.splice(v, 1);
    }
    if (val == 'info') {
      this.model.additionalData.splice(id, 1);
    }
    if (val == 'trole') {
      this.model.teacherRole1.splice(id, 1);
    }
    if (val == 'subj') {
      this.model.teacherRole1[id].additional.splice(v, 1);
    }
  }

  editRemove(val, id, v = '') {
    if (val == 'exp') {
      this.editmodel.teacherExperience.splice(id, 1);
    }
    if (val == 'sub') {
      this.editmodel.teacherExperience[id].nameValuePairs.experience_Subjects.splice(v, 1);
    }
    if (val == 'info') {
      this.editmodel.additionalData.splice(id, 1);
    }
    if (val == 'trole') {
      this.editmodel.teacherRole1.splice(id, 1);
    }
    if (val == 'subj') {
      this.editmodel.teacherRole1[id].additional.splice(v, 1);
    }
  }

  onSubmit() {
    this.model.teacherPhone = this.model.teacherPhone.replace(/\+/g, '');
    if (this.model['teacherRole1'].length == 0) {
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "Please add Teacher Role Suject and Class!"
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
      return;
    } else if (this.model['teacherRole1'][0].Role == '' || this.model['teacherRole1'][0].additional.length == 0) {
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "Please add Teacher Role Suject and Class!"
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
      return;
    } else if (this.model['teacherRole1'][0].additional.length != 0) {
      if (this.model['teacherRole1'][0].additional[0]['Classs'] == '' || this.model['teacherRole1'][0].additional[0]['Stream'] == '' || this.model['teacherRole1'][0].additional[0]['Subject'] == '') {
        let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
          width: '350px',
          data: "Please add Teacher Role Suject and Class!"
        });
        dialogRef1.afterClosed().subscribe(result => {
        });
        return;
      }
    }
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    let inputEl1: HTMLInputElement = this.el.nativeElement.querySelector('#contract');
    let fileCount1: number = inputEl1.files.length;
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');
    var formData = new FormData();
    Object.keys(this.model).forEach((k, indf) => {
      if (k == 'teacherExperience') {
        var d = this.model[k];
        this.model[k].forEach(element => {
          let m = '';
          var len = element.nameValuePairs.experience_Subjects.length;
          element.nameValuePairs.experienceStartDate = this.datePipe.transform(element.nameValuePairs.experienceStartDate, 'dd/MM/yyyy');
          element.nameValuePairs.experienceEndDate = this.datePipe.transform(element.nameValuePairs.experienceEndDate, 'dd/MM/yyyy');
          element.nameValuePairs.experience_Subjects.forEach(function (element1, index) {
            if (m == '')
              m = element1.subjects;
            else {
              if (element1.subjects != '') m = m + ',' + element1.subjects;
            }
            if (len - 1 == index) {
              element.nameValuePairs.experienceSubjects = m;
            }
          });
        });
      }
      if (k == 'teacherDob') {
        this.model[k] = this.datePipe.transform(this.model[k], 'dd/MM/yyyy');
      }
      if (k == 'startDate') {
        this.model[k] = this.datePipe.transform(this.model[k], 'dd/MM/yyyy');
      }
      if (k == 'teacherRole1') {
        this.model[k].forEach(element => {
          element.additional.forEach(element5 => {
            this.model['teacherRole'].push(element5);
          });
          //return;
        });
      }
      if (k != 'teacherRole1') {
        if (k == 'teacherRole' || k == 'teacherExperience' || k == 'additionalData')
          formData.append(k, JSON.stringify(this.model[k]));
        else
          formData.append(k, this.model[k]);
      }
    });
    //return;
    if (fileCount > 0) {
      formData.append('teacherImage', inputEl.files.item(0));
    }
    if (fileCount1 > 0) {
      formData.append('teacherContractFile', inputEl1.files.item(0));
    }
    this.http.post(this.Url + 'api/teacher', formData, { headers: headers }).subscribe((val) => {
      this.resdata1 = val;
      if(this.resdata1.status==true){
        if(this.resdata1.message=='Teacher already exist'){
          let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
            width: '350px',
            data: "Teacher already exist"
          });
          dialogRef1.afterClosed().subscribe(result => {
          });
          return;
        }else{
          this.model = {
            teacherSchool: this.User.schoolId,
            teacherExperience: [],
            additionalData: [],
            teacherRole1: [],
            teacherRole: [],
            endDate: '',
            teacherGender: '',
            teacherBirthCertNo: '',
            teacherPhone: '',
            teacherId: '',
            teacherUPI: '',
            teacherNationality: ''
          }
          this.myForm.resetForm(this.model);          
          this.getTeachers();
          this.closeModal();
        }
      }
      
    }, err => {
      console.log(err);
    });
  }
  //call this wherever you want to close modal
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  //call this wherever you want to close modal
  private closeModals(): void {
    this.closeBtns.nativeElement.click();
  }


  changeClass(id, index) {
    console.log(index);
    this.ajaxService.getMethod({ classId: id }, 'api/class/class').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.streams[index] = this.resdata.data;
        // console.log(this.streams[index]);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  deleteTeacher(teacherId) {
    this.ajaxService.getMethod({ teacherId: teacherId }, 'api/teacher/deleteTeacher').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.getTeachers();
      } else {
      }
    }, err => {

      console.log(err);
    });
  }

  openDialog(fname, fid): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (fname == 'delete')
          this.deleteTeacher(fid);
      }
    });
  }

  preview(files,source='') {
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
      if(source!='')
        this.editimgURL = reader.result;
      else
        this.imgURL = reader.result;
    }
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

  getSubject() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/subject').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.subjects = this.resdata.data;
        // console.log(this.subjects);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  getRoles() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/teacher/getteacherrole').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.teacherRoles = this.resdata.data;
        // console.log(this.teacherRoles);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

}
