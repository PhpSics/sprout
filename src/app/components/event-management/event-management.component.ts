import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  resdata: any = {};
  eventData: any = {};
  User: any = {};
  events: any = [];
  terms: any = [];
  classes: any = [];
  teachers: any = [];
  staffs: any = [];
  termPost: any = {};
  Url: any = environment.baseUrl;
  submitted = false;
  errorMessage: any = '';
  termForm: FormGroup;
  teacherList: any = [];
  staffList: any = [];
  classList: any = [];
  public imagePath;
  imgURL: any = 'assets/images/add-image.jpg';
  imgUrls: any = 'assets/images/add-image.jpg';
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  dropdownSettings1 = {};
  staffSettings = {};
  eventmoreData:any = [];
  public message: string;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, 
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private el: ElementRef) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.termForm = this.formBuilder.group({
      eventTitle: ['', [Validators.required]],
      eventTermId: ['', [Validators.required]],
      schoolId: [this.User.schoolId],
      fromName: [this.User.userName],
      class: [''],
      teacher: [''],
      staff: [''],
      eventDescription: ['', [Validators.required]],
      eventLocation: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      eventImages: [''],
      eventStarttime: ['', [Validators.required]],
      eventEndtime: ['', [Validators.required]],
    });
    this.getTerms();
    this.getAdminEvents();
    this.getTeachers();
    this.getClass();
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'teacherName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: '_id',
      textField: 'className',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
    this.staffSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'staffName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
  }

  getTerms() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/fees/getterm').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.terms = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
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

  getStaffs() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/getnonstaff').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.staffs = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  getAdminEvents(termId='') {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId, fromUserType: 'admin',termId:termId }, 'api/school/adminevent').subscribe((val) => {
      this.eventData = val;
      if (this.eventData.status == true) {
        this.events = this.eventData.data.AdminEvents;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  get f() { return this.termForm.controls; }

  onSelectAll(items: any, type) {
    if (type == 'teacher') {
      this.teacherList = [];
      items.forEach(element => {
        this.teacherList.push(element._id);
      });
    }else if (type == 'class') {
      this.classList = [];
      items.forEach(element => {
        this.classList.push(element._id);
      });
    }else if (type == 'staff') {
      this.staffList = [];
      items.forEach(element => {
        this.staffList.push(element._id);
      });
    }
  }

  onItemSelect(items: any, type) {
    if (type == 'teacher') {
      this.teacherList.push(items._id);
    }else if (type == 'class') {
      this.classList.push(items._id);
    }else if (type == 'staff') {
      this.staffList.push(items._id);
    }
  }
  onItemDeselect(items: any, type) {
    if (type == 'teacher') {
      var index = this.teacherList.indexOf(items._id);
      if (index > -1) {
        this.teacherList.splice(index, 1);
      }
    }else if(type == 'class') {
      var index1 = this.classList.indexOf(items._id);
      if (index1 > -1) {
        this.classList.splice(index1, 1);
      }
    }else if(type == 'staff') {
      var index2 = this.staffList.indexOf(items._id);
      if (index2 > -1) {
        this.staffList.splice(index2, 1);
      }
    }
  }

  onDeSelectAll(items: any, type) {
    if (type == 'teacher') {
      this.teacherList = [];
    }else if (type == 'class') {
      this.classList = [];
    }else if (type == 'staff') {
      this.staffList = [];
    }
  }

  getEvent(ind){
    this.eventmoreData = this.events[ind];
  }

  saveEvent() {
    this.submitted = true;
    if (this.termForm.invalid) {
      return;
    }
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');
    var lst = $("#start").val();
    var est = this.formatDate(new Date(lst))+'T'+'00:00:00.000Z';
    console.log(est);
    var startTime = this.formatDate(new Date(lst))+'T'+this.ConvertTimeformat(24,this.termForm.value['eventStarttime'])+'.000Z';
    var endTime = this.formatDate(new Date(lst))+'T'+this.ConvertTimeformat(24,this.termForm.value['eventEndtime'])+'.000Z';
    var formData = new FormData(); 
    Object.keys(this.termForm.value).forEach((k) => {
      if(k=='eventDate'){
        formData.append(k, est)
      }else if(k=='eventStarttime'){
        formData.append(k, startTime)
      }else if(k=='eventEndtime'){
        formData.append(k, endTime)
      }else
        formData.append(k, this.termForm.value[k]);
    })
    formData.append('fromImage','');
    formData.append('pteacher',this.teacherList.toString());
    formData.append('pclass',this.classList.toString());
    formData.append('staffId',this.staffList.toString());
    if (fileCount > 0) {
      formData.append('eventImage', inputEl.files.item(0));
    }
    this.http.post(this.Url+'api/school/adminevent', formData,{headers:headers}).subscribe((val) => {
      this.termForm.reset({ schoolId: this.User.schoolId,fromName:this.User.userName,eventTermId:'' });
      this.submitted = false;
      this.getAdminEvents();
      this.closeModal();
    }, err => {
      console.log(err);
    });
  }

  //call this wherever you want to close modal
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  preview(files) {
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
      this.imgURL = reader.result;
    }
  }

  ConvertTimeformat(format, str) {
    var time = str;
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "pm" && hours < 12) hours = hours + 12;
    if (AMPM == "am" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return sHours + ":" + sMinutes+":00";
}

formatDate(today){
  var dd = today.getDate();
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 

  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;
  return today;
}
}
