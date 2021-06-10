import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  show: boolean = false;
  User: any = [];
  classList: any = [];
  subjects: any = [];
  ClsList: any = [];
  classes: any = [];
  model: any = {};
  homeworkForm: FormGroup;
  submitted: any = false;
  Url: any = environment.baseUrl;
  defImgUrl: any = environment.defaultUserImage;
  resdata: any = [];
  roles: any = [];
  pList: any = [];
  pLists: any = [];
  permissionList: any = [];
  ps: any = 0;
  staffs: any = [];
  messages: any = [];
  temptrigger:boolean;
  messageChangeList: any = [];
  messageList: any = [];
  messageNewList: any = [];
  staffSettings: any = {};
  studentSettings: any = {};
  msgForm: FormGroup;
  students: any = [];
  classId: any = '';
  subjectId: any = '';
  studsId: any[];
  schoolName: any;
  teacherName: any;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService, private dataService: DataService,
    private http: HttpClient, private formBuilder: FormBuilder,
    private router: Router, private el: ElementRef,
    private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
    this.User = this.local.getData('loginData');
    this.teacherName = this.User['teacherName']
    console.log(this.User);
    console.log(this.teacherName)
this.schoolName = this.User.additionalData[0].schoolName
console.log(this.dataService)
    this.msgForm = this.formBuilder.group({
      teacherId: [''],
      msgText: ['', [Validators.required]],
      adminId: '',
      userType: 'teacher',
      topic: ['', [Validators.required]],
      schoolId: [this.User.teacherSchool],
      isAdmin: false,
      staffId: [''],
      chatId: '',
      FromTeacherid: [this.User._id],
      
      studentId: '',
      FromAdminid: '',
      FromStudid: '',
      studentClassId: [this.User.classId],
      toStudentId: [''],
      ToUser: [''],
      fromName: [this.User.teacherName],
      fromImage: [this.User.teacherImage],
      subjectId: [this.dataService.subjectId]
    });
    this.getClass();
    if (this.dataService.classId == undefined) {
      this.dataService.classId = '';
      this.dataService.streamId = '';
      this.dataService.clsIndex = '';
    }
    else {
      this.changeSubDynamic();
    }
    if (this.dataService.subjectId == undefined)
      this.dataService.subjectId = '';
    this.model = {
      classId: this.dataService.clsIndex,
      subjectId: this.dataService.subjectId
    }
    this.getPermission();
    this.getMessages();
    this.getStudents();
    this.getStaffs();
    this.studentSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'studentName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
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
    this.classId = this.dataService.classId;
    this.subjectId = this.dataService.subjectId;
  }

  goToChatRoom(RoomId, index) {
    this.dataService.chatRoomId = RoomId;
    this.dataService.chatRoom = this.messageNewList[index];
    console.log(this.dataService.chatRoom)
    this.router.navigate(['/my-chat']);
  }

  sendMessage() {
    this.submitted = true;
    var studsId = []
    var cnt = 0
    if (this.msgForm.invalid) {
      return;
    }
    // if (this.msgForm.value.toStudentId == '' && this.msgForm.value.staffId == '') {
    //   let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
    //     width: '350px',
    //     data: "Please Select a Recipient!"
    //   });
    //   dialogRef1.afterClosed().subscribe(result => {
    //   });
    //   return;
    // }
    if(this.msgForm.value.toStudentId){
     cnt = this.msgForm.value.toStudentId.length;
    }
    var stdIds =this.msgForm.value.toStudentId

    console.log(this.msgForm.value.toStudentId)
    var stdId = '';
    var stdName = '';
    if(this.msgForm.value.toStudentId){
    this.msgForm.value.toStudentId.forEach(function (element, index) {
      if (cnt - 1 == index) {
        stdId += element._id;
        stdName += element.studentName;
      } else {
        stdId += element._id + ',';
        stdName += element.studentName + ',';
      }
      studsId.push(element._id) 
    }); 
  }
    this.studsId = studsId
    this.msgForm.value.studentId = studsId;
    this.msgForm.value.schoolName = this.schoolName;
    this.msgForm.value.toStudentId = stdId;
    this.msgForm.value.ToUser = stdName;
    var url = 'api/teacher/createbroadcast';
console.log(cnt)
    
    if (cnt < 2 && this.msgForm.value.isAdmin == false ) {
      var url = 'api/teacher/addmessage';
    }
    else if ( cnt == 0 && this.msgForm.value.isAdmin == true) {
      // this.msgForm.value.teacherId = this.User._id;
     
      console.log("kkkkkkkkkkkkkkk")
      var url = 'api/teacher/addmessage';
    }
  
    console.log(this.msgForm.value)
    this.ajaxService.postMethod(url, this.msgForm.value).subscribe(
      (res) => {
        this.resdata = res;
        console.log( this.resdata)
        if (this.resdata.status == true) {
          this.submitted = false;
          this.msgForm.reset(
            {
              userType: 'teacher',
              schoolId: this.User.teacherSchool,
              isAdmin: false,
              FromTeacherid: this.User._id,
              studentClassId: this.User.classId,
              fromName: this.User.teacherName,
              fromImage: this.User.teacherImage,
              subjectId: this.dataService.subjectId
            });
           
          this.closeModal();
          this.getMessages();
        }
      }, err => {
        console.log(err);
      }
     
      );
      
  }

  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  get f() { return this.msgForm.controls; }

  getStaffs() {
    this.ajaxService.getMethod({ schoolId: this.User.schoolId }, 'api/school/getnonstaff').subscribe((val) => {
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

  getStudents() {
    this.ajaxService.getMethod({ class: this.dataService.classId,  school: this.User.teacherSchool }, 'api/student').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.students = this.resdata.data;
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }

  changeSubDynamic() {
    if (this.dataService.clsIndex != '' && this.dataService.clsIndex != undefined) {
      var l = this.classes[this.dataService.clsIndex];
      this.subjects = l.subjectName;
    }
  }

  getClass() {
    this.classList = this.User.teacherRole;
    var cls = [];
    var index = 0;
    var tVal = this;
    this.classList.forEach(function (element, index1) {
      var val = tVal.ClsList.indexOf(element.Classs._id + '-' + element.Stream._id);
      if (val == -1) {
        tVal.ClsList.push(element.Classs._id + '-' + element.Stream._id);
        cls[index] = [];
        cls[index]['subjectName'] = [];
        cls[index]['classId'] = element.Classs._id;
        cls[index]['roleId'] = element.Role._id;
        cls[index]['className'] = element.Classs.className;
        cls[index]['streamId'] = element.Stream._id;
        cls[index]['streamName'] = element.Stream.streamName;
        cls[index]['subjectName'].push({ sId: element.Subject._id, sName: element.Subject.subjectName });
        index++;
      } else {
        cls[val]['subjectName'].push({ sId: element.Subject._id, sName: element.Subject.subjectName });
      }
    });
    this.classes = cls;
    console.log(this.classes)
  }

  changeClass(event) {
    this.dataService.subjectId = '';
    this.model.subjectId = '';
    if (event.target.value != '') {
      this.dataService.classId = event.target.options[event.target.selectedIndex].getAttribute('data-class');
      this.dataService.streamId = event.target.options[event.target.selectedIndex].getAttribute('data-stream');
      this.dataService.roleId = event.target.options[event.target.selectedIndex].getAttribute('data-role');
      var val = event.target.options[event.target.selectedIndex].getAttribute('data-index');
      var l = this.classes[val];
      this.dataService.clsIndex = val;
      this.subjects = l.subjectName;
      this.msgForm.controls.studentClassId.setValue(this.dataService.classId);
      this.msgForm.controls.subjectId.setValue('');
    } else {
      this.dataService.classId = '';
      this.dataService.streamId = '';
      this.dataService.roleId = '';
      this.dataService.clsIndex = '';
      this.subjects = [];
      this.msgForm.controls.studentClassId.setValue(this.dataService.classId);
      this.msgForm.controls.subjectId.setValue('');
    }
    this.classId = this.dataService.classId;
    this.subjectId = this.dataService.subjectId;
    this.pList = [];
    this.pLists = [];
    this.getPermission();
    this.getMessages();
    this.getStudents();
  }

  getPermission() {
    if (this.dataService.roleId != undefined && this.dataService.roleId != '') {
      this.ajaxService.getMethod({ roleId: this.dataService.roleId }, 'api/permission/role').subscribe((val) => {
        this.resdata = val;
        if (this.resdata.status == true) {
          this.roles = this.resdata.data;
          this.permissionList = this.roles[0].permissionList;
          this.permissionList.forEach(element => {
            var p = [];
            p = element['Permission'];
            p.forEach(element1 => {
              this.pList.push(element1.permissionName);
            });
          });
          console.log(this.pList);
          this.dataService.permissionList = this.pList;
          this.pLists = this.pList;
        } else {
          console.log('false');
        }
      }, err => {
        console.log(err);
      });
    } else {
      this.dataService.permissionList = [];
      this.pLists = [];
    }
  }

  changeSubject(id) {
    this.dataService.subjectId = id;
    this.getMessages();
    this.msgForm.controls.subjectId.setValue(this.dataService.subjectId);
    this.subjectId = this.dataService.subjectId;
  }

  getMessages() {
    // console.log('hey') ,classId:this.dataService.classId,subjectId:this.dataService.subjectId
    console.log(this.User._id)    
  
  
    // this.ajaxService.getMethod({ teacherId: this.User._id }, 'api/teacher/getall').subscribe(val => {
      this.ajaxService.getMethod({ teacherId: this.User._id }, 'api/teacher/getall').subscribe((val) => {
        this.resdata = val;
        console.log(this.resdata)
        if (this.resdata.status == true) {
          this.messages = this.resdata.data;
          console.log(this.messages)
          if(this.messages != null)
          {
            this.temptrigger = true;
            this.formatMessages();
          }          
        } else {
          console.log('false');
        }
    
     
    }, err => {
      console.log(err);
    });    
  }

  formatMessages() {    
    var schoolNam = this.schoolName
    var teacherNAme = this.teacherName
    this.messageChangeList = [];
    if (this.messages.BroadcastList.length > 0) {
      this.messages.BroadcastList.forEach(element => {
        element['chatSType'] = 'broadcast';
        this.messageChangeList.push(element);
      });
    }
    if (this.messages.Comments.length > 0) {
      this.messages.Comments.forEach(element => {
        element['chatSType'] = 'comment';
        this.messageChangeList.push(element);
      });
    }
    if (this.messages.Messages.length > 0) {
      this.messages.Messages.forEach(element => {
        element['chatSType'] = 'message';
        this.messageChangeList.push(element);
      });
    }
    this.sortData();
    var self = this;
    self.messageList = [];
    console.log(this.messageChangeList)
    var index = 0;
    this.messageChangeList.forEach(function (elementVal, indexs) {
      self.messageList[index] = {};
      self.messageList[index]['chatSType'] = elementVal.chatSType;
      self.messageList[index]['studentId'] = '';
      self.messageList[index]['teacherId'] = '';
      self.messageList[index]['staffId'] = '';
      self.messageList[index]['classId'] = '';
      self.messageList[index]['subjectId'] = '';
      self.messageList[index]['fromTId'] = '';
      self.messageList[index]['fromPId'] = '';
      self.messageList[index]['fromAId'] = '';
      self.messageList[index]['uName'] = '';
      if (elementVal.chatSType == 'broadcast') {
        self.messageList[index]['chatRoomId'] = elementVal._id;
        if (elementVal.ToName != self.User.userName)
          self.messageList[index]['uName'] = '[' + elementVal.ToName + ']';
        else self.messageList[index]['uName'] = elementVal.FromName;
        self.messageList[index]['cName'] = 'Broadcastlist:' + elementVal.topic;
        self.messageList[index]['desc'] = elementVal.msgText;
        self.messageList[index]['createdAt'] = elementVal.createdAt;
        if (elementVal.userType == "teacher") {
          self.messageList[index]['fromTId'] = elementVal.FromTeacherid._id;
          self.messageList[index]['image'] = elementVal.FromTeacherid.teacherImage;
        }
        if (elementVal.userType == "parent") {
          self.messageList[index]['fromPId'] = elementVal.FromStudid._id;
          self.messageList[index]['image'] = elementVal.FromStudid.studentImage;
        }
        if (elementVal.userType == "admin") {
          self.messageList[index]['fromAId'] = elementVal.FromAdminid._id;
          self.messageList[index]['image'] = elementVal  
           
          
           .FromAdminid.userImage;
        }
        index++;
      } else if (elementVal.chatSType == 'message') {
        self.messageList[index]['chatRoomId'] = elementVal.chatRoomId;
        self.messageList[index]['isAdmin'] = elementVal.isAdmin;
        // if (elementVal.ToName != self.User.userName)
        //   self.messageList[index]['uName'] = elementVal.ToName;
        // if(self.messageList[index]['uName']=='')
        // self.messageList[index]['uName'] = elementVal.FromName;
        self.messageList[index]['cName'] = elementVal.topic;
        self.messageList[index]['createdAt'] = elementVal.createdAt;
        self.messageList[index]['desc'] = elementVal.msgText;
        self.messageList[index]['studentId'] = elementVal.studentId.join();
        self.messageList[index]['teacherId'] = elementVal.teacherId.join();
        self.messageList[index]['classId'] = elementVal.classId.join();
        self.messageList[index]['staffId'] = elementVal.staffId.join();
        if (elementVal.userType == "teacher") {
        

          self.messageList[index]['fromTId'] = elementVal.FromTeacherid._id;
          // self.messageList[index]['image'] = elementVal.FromTeacherid.teacherImage;
          if (elementVal.toStudentImg != null) {
            self.messageList[index]['image'] = elementVal.toStudentImg.studentImage; 
            self.messageList[index]['uName'] = elementVal.toStudentImg.studentName;
          } else if (elementVal.toAdminImg != null) {
            self.messageList[index]['image'] = elementVal.toAdminImg.userImage;
            self.messageList[index]['uName'] = schoolNam
          }
          if (self.messageList[index]['uName'] == ''){
            self.messageList[index]['uName'] = elementVal.ToName;
            if(elementVal.ToName == teacherNAme){
              self.messageList[index]['uName'] = elementVal.FromName;
            }
            if(elementVal.FromName == ''){
              self.messageList[index]['uName'] = schoolNam
            } else if(elementVal.ToName == ''){
              self.messageList[index]['uName'] = elementVal.FromName;
            }
          }
        }
        if (elementVal.userType == "parent") {
          self.messageList[index]['viewStatus'] = elementVal.viewStatus;
          self.messageList[index]['fromPId'] = elementVal.FromStudid._id;
          self.messageList[index]['image'] = elementVal.FromStudid.studentImage;
          if (self.messageList[index]['uName'] == '')
            self.messageList[index]['uName'] = elementVal.FromStudid.studentName;
        }
        if (elementVal.userType == "admin") {
          self.messageList[index]['viewStatus'] = elementVal.viewStatus;
          self.messageList[index]['fromAId'] = elementVal.FromAdminid._id;
          self.messageList[index]['image'] = elementVal.FromAdminid.userImage;
          if (self.messageList[index]['uName'] == '')
            self.messageList[index]['uName'] = schoolNam
        }
        if (elementVal.senderType != 'teacher') {
          if (elementVal.senderType == 'admin') {
            self.messageList[index]['image'] = elementVal.senderAdminId.userImage;
            self.messageList[index]['uName'] = schoolNam
          } else if (elementVal.senderType == 'parent') {
            self.messageList[index]['image'] = elementVal.senderStudentId.studentImage;
            self.messageList[index]['uName'] = elementVal.senderStudentId.studentName;
          }
        }
        if (self.messageList[index]['image'] == undefined)
          self.messageList[index]['image'] = '';
        index++;
      } else {
        if (elementVal.mainId != null) {
          self.messageList[index]['chatRoomId'] = elementVal.mainId._id;
          if (elementVal.toName != self.User.userName)
            self.messageList[index]['uName'] = elementVal.toName + ' [Homework]';
          else self.messageList[index]['uName'] = elementVal.fromName + ' [Homework]';
          self.messageList[index]['cName'] = 'Homework:' + elementVal.mainId.description;
          self.messageList[index]['createdAt'] = elementVal.createdAt;
          self.messageList[index]['desc'] = elementVal.commentText;
          self.messageList[index]['classId'] = elementVal.classId;
          self.messageList[index]['subjectId'] = elementVal.mainId.subject;
          self.messageList[index]['studentId'] = elementVal.mainId.studentId;
          if (elementVal.studentId != null) {
            self.messageList[index]['image'] = elementVal.studentId.studentImage;
          }
          else if (elementVal.teacherId != null) {
            self.messageList[index]['image'] = elementVal.teacherId.teacherImage;
          }
          else if (elementVal.adminId != null) {
            self.messageList[index]['image'] = elementVal.adminId.userImage;
          }
          index++;
        } else {
          // console.log(index);
          self.messageList.splice(index, 1);
          index = index-1;
        }
      }
    });
    this.messageNewList = self.messageList;
    console.log(this.messageNewList)
  }

  sortData() {
    return this.messageChangeList.sort((a, b) => {
      return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
    });
  }

  showAlert() {
    let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
      width: '350px',
      data: "Please Select a Subject!"
    });
    dialogRef1.afterClosed().subscribe(result => {
    });
  }

}
