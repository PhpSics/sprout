import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-class-broadcast-list',
  templateUrl: './class-broadcast-list.component.html',
  styleUrls: ['./class-broadcast-list.component.css']
})
export class ClassBroadcastListComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  resdata: any = [];
  classId: string;
  messages: any;
  messageChangeList: any[];
  messageList: any[];
  messageNewList: any[];
  searchText: any = '';
  msgForm: FormGroup;
  student: any = [];
  submitted: any = false;
  User: any;
  Url: any = environment.baseUrl;
  studentList: any = [];
    studentSettings: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  schoolName: any;

  constructor(   public dialog: MatDialog, private formBuilder: FormBuilder,private dataService: DataService, private ajaxService: CommonfunctionService, private router: Router,  private local: LocalstorageService,) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    this.schoolName = this.User.schooldetails[0].schoolName
    if (this.dataService._showClass == undefined) {
      this.router.navigate(['/class-management']);
    } else {
      this.classId = this.dataService._showClass;
     
    }

    this.msgForm = this.formBuilder.group({
      teacherId: [''],
      studentsId: [''],
      msgText: ['', [Validators.required]],
      adminId: '',
      userType: 'admin',
      classId: [''],
      topic: ['', [Validators.required]],
      schoolId: [this.User.schoolId],
      isAdmin: 'false',
      staffId: [''],
      chatId: '',
      FromAdminid: [this.User._id],
      studentId: '',
      FromTeacherid: '',
      FromStudid: '',
      fromName: [this.User.userName],
      fromImage: [this.User.userImage],
     studentClassId : this.dataService._showClass
    });
    this.studentSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'studentName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    console.log(this.dataService)
    var f = { "classId": this.dataService._showClass, "streamId":this.dataService._showStream };
    this.getMessages(); 
    this.getStudent();
  }
  getMessages() {
    console.log(this.dataService._showClass)
    console.log( this.dataService._showStream)

    this.ajaxService.getMethod({ classId: this.dataService._showClass,streamId: this.dataService._showStream }, 'api/teacher/getaAllClassMsg').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.messages = this.resdata.data;
        this.formatMessages();
      } else {
      }
    }, err => {
    });  
  }
  getStudent() {
    var classId = this.dataService._showClass
  var streamId = this.dataService._showStream
  console.log(classId)
  console.log(streamId)

    this.ajaxService.getMethod({ class: classId}, 'api/student').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.student = this.resdata.data;
        // console.log(this.student)
      } else {
      }
    }, err => {
    });
  }
   onDeSelectAll(items: any, type) {

    if (type == 'student') {
      this.studentList = [];
    }
  }
  onSelectAll(items: any, type) {

 if (type == 'student') {
      this.studentList = [];
      items.forEach(element => {
        this.studentList.push(element._id);
      });
    }
  }
  onItemSelect(items: any, type) {
    // this.studentList = [];
    console.log(items)
    if (type == 'student') {
      this.studentList.push(items._id);
      console.log(this.studentList)
    }
  }
  onItemDeselect(items: any, type) {
if (type == 'student') {

      var index3 = this.studentList.indexOf(items._id);
      if (index3 > -1) {
        this.studentList.splice(index3, 1);
      }
    }
  }
  sendMessage() {
    this.submitted = true;
    if (this.msgForm.invalid) {
      return;
    }
   
   
    this.msgForm.value.studentId = this.studentList.join();
   console.log(this.msgForm.value.studentId)
    if (this.studentList.length == 0) {
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "Please Select a Recipient!"
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
      return; 
    }
    console.log(this.studentList)
    var url = 'api/teacher/createbroadcast';
    console.log(this.studentList.length)
    console.log(this.msgForm.value.studentId)
    if (this.studentList.length == 1 ) {
      this.msgForm.value.classId = '';
      this.msgForm.value.studentClassId = this.dataService._showClass
      var url = 'api/teacher/addmessage';
      console.log("-----message-----")
    }
    console.log(this.msgForm.value)
    this.ajaxService.postMethod(url, this.msgForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.submitted = false;
          this.msgForm.reset(
            {
              teacherId: '',
              adminId: '',
              userType: 'admin',
              classId: '',
              schoolId: this.User.schoolId,
              isAdmin: 'false',
              staffId: '',
              chatId: '',
              FromAdminid: this.User._id,
              studentId: '',
              FromTeacherid: '',
              FromStudid: '',
              topic : '',
              msgText:'',
              fromName: this.User.userName,
              fromImage: this.User.userImage
            });
        
          this.studentList = [];
          this.getMessages();
          this.closeModal();
        }
      });
  }
  formatMessages() {
    var schoolName = this.schoolName
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
    var index = 0;
    // console.log(this.messageChangeList)
    this.messageChangeList.forEach(function (elementVal, index1) {
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
          self.messageList[index]['uName'] = elementVal.ToName;
        // else self.messageList[index]['uName'] = elementVal.FromName;
        self.messageList[index]['cName'] = 'Broadcastlist:' + elementVal.topic;
        self.messageList[index]['desc'] = elementVal.msgText;
        self.messageList[index]['createdAt'] = elementVal.createdAt;
        if (elementVal.userType == "teacher" && elementVal.FromTeacherid != null) {
          self.messageList[index]['image'] = elementVal.FromTeacherid.teacherImage;
          self.messageList[index]['fromTId'] = elementVal.FromTeacherid._id;
          if (self.messageList[index]['uName'] == '')
            self.messageList[index]['uName'] = elementVal.FromTeacherid.teacherName;
        }
        if (elementVal.userType == "parent" && elementVal.FromStudid != null) {
          self.messageList[index]['fromPId'] = elementVal.FromStudid._id;
          self.messageList[index]['image'] = elementVal.FromStudid.studentImage;
          if (self.messageList[index]['uName'] == '')
            self.messageList[index]['uName'] = elementVal.FromStudid.studentName;
        }
        if (elementVal.userType == "admin" && elementVal.FromAdminid != null) {
          self.messageList[index]['fromAId'] = elementVal.FromAdminid._id;
          self.messageList[index]['image'] = elementVal.FromAdminid.userImage;
        }
        index++;
      } else if (elementVal.chatSType == 'message') {
        self.messageList[index]['chatRoomId'] = elementVal.chatRoomId;
        self.messageList[index]['isAdmin'] = elementVal.isAdmin;
        if (elementVal.ToName != self.User.userName)
           self.messageList[index]['uName'] = elementVal.ToName;
        // self.messageList[index]['uName'] = elementVal.FromName;
        self.messageList[index]['cName'] = elementVal.topic;
        self.messageList[index]['createdAt'] = elementVal.createdAt;
        self.messageList[index]['desc'] = elementVal.msgText;
        self.messageList[index]['studentId'] = elementVal.studentId.join();
        self.messageList[index]['teacherId'] = elementVal.teacherId.join();
        self.messageList[index]['classId'] = elementVal.classId.join();
        self.messageList[index]['staffId'] = elementVal.staffId.join();
        if (elementVal.userType == "teacher") {
          if (elementVal.FromTeacherid != null) {
            self.messageList[index]['image'] = elementVal.FromTeacherid.teacherImage;
            self.messageList[index]['fromTId'] = elementVal.FromTeacherid._id;
            if (self.messageList[index]['uName'] == '')
              self.messageList[index]['uName'] = elementVal.FromTeacherid.teacherName;
          }
        }
        if (elementVal.userType == "parent") {
          if (elementVal.FromStudid != null) {
            self.messageList[index]['image'] = elementVal.FromStudid.studentImage;
            self.messageList[index]['fromPId'] = elementVal.FromStudid._id;
            if (self.messageList[index]['uName'] == '')
              self.messageList[index]['uName'] = elementVal.FromStudid.studentName;
          }
        }
        if (elementVal.userType == "admin") {
          // self.messageList[index]['image'] = elementVal.FromAdminid.userImage;
          self.messageList[index]['fromAId'] = elementVal.FromAdminid._id;
          if (elementVal.toTeacherImg != null) {
            self.messageList[index]['image'] = elementVal.toTeacherImg.teacherImage;
            console.log(self.messageList[index]['uName'])
            if (self.messageList[index]['uName'] == '')
              self.messageList[index]['uName'] = elementVal.toTeacherImg.teacherName;
          }
          if (elementVal.toStudentImg != null) {
            console.log('mey')
            self.messageList[index]['image'] = elementVal.toStudentImg.studentImage;
            if (self.messageList[index]['uName'] == '')
              self.messageList[index]['uName'] = elementVal.toStudentImg.studentName;
          }
          if(elementVal.ToName==schoolName){
            self.messageList[index]['uName'] = elementVal.FromName;
           }
        }
        if (elementVal.senderType != 'admin') {
          if (elementVal.senderType == 'teacher' && elementVal.senderTeacherId != null) {
            self.messageList[index]['image'] = elementVal.senderTeacherId.teacherImage;
            self.messageList[index]['uName'] = elementVal.senderTeacherId.teacherName;
          } else if (elementVal.senderType == 'parent' && elementVal.senderStudentId != null) {
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
        }else{
          console.log(index);
          self.messageList.splice(index, 1);
        }
      }
    });
    this.messageNewList = self.messageList;
  }
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }
  sortData() {
    return this.messageChangeList.sort((a, b) => {
      return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
    });
  }

  goToChatRoom(RoomId, chatSType, name, image, index) {
    this.dataService.chatRoomId = RoomId;
    this.dataService.chatType = chatSType;
    this.dataService.setName = name;
    this.dataService.setImage = image;
    this.dataService.showFee = this.messageNewList[index];
    this.router.navigate(['/my-chat']);
  }

}
