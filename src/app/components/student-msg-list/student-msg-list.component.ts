import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-student-msg-list',
  templateUrl: './student-msg-list.component.html',
  styleUrls: ['./student-msg-list.component.css']
})
export class StudentMsgListComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  User: any = {};
  chatForm: FormGroup; 
  resdata: any = {};
  messages: any = {};
  messageChangeList: any[];
  messageList: any[];
  messageNewList: any[];
  studentName: string;
  Url: any = environment.baseUrl;
  searchText: any = '';
  studentImage: string;
  studentClass: string;
  studentClassId: any;
  msgForms: any = [];
  studentDate: any;
  submitted = false;

  chatForms: FormGroup;
  msgForm: { teacherId: string; adminId: string; userType: string; classId: any; schoolId: any; isAdmin: string; staffId: string; chatId: string; FromAdminid: any; studentId: string; FromTeacherid: string; FromStudid: string; fromName: any; fromImage: any; toStudentId: any; ToUser: any; };
  schoolName: string;

  constructor( private dataService: DataService,
    private ajaxService: CommonfunctionService, private router: Router,  private formBuilder: FormBuilder,
    private local: LocalstorageService,) { }

  ngOnInit() {

    if (this.dataService.studentId == undefined) {
      this.router.navigate(['/student-profile']);
      return;
    } else
   
    this.studentClassId = this.dataService._studArray.studentClass._id;
    console.log(this.dataService)
    if (this.dataService.studentId == undefined) {
      this.router.navigate(['/students']);
    } else {
      this.studentName = this.dataService.studentName;
      this.studentImage = this.dataService.studentImage;
      this.studentClass = this.dataService.studentClass;
    }
    
    this.chatForm = this.formBuilder.group({

      msgText: ['', [Validators.required]],
      adminId: [this.User._id],
      userType: ['admin'],
      classId: [this.dataService.studentClass['_id']],
      topic: ['', [Validators.required]],
      schoolId: [this.User.schoolId],
      isAdmin: ["false"],
      
      // chatId: [this.chatRoomId],
      FromAdminid: [this.User._id],
      studentId: [this.dataService._studArray['_id']],
      FromTeacherid: '',
      FromStudid: '',
      fromName: [this.User.userName],
      fromImage: [this.User.userImage]

    });
    this.User = this.local.getData('AdminloginData');
    this.schoolName = this.User.schooldetails[0].schoolName
    console.log(this.schoolName)
    console.log(this.dataService)
  
    this.getMessages();
  }
  get f() {
    console.log(this.chatForm.controls) 
    return this.chatForm.controls; }
  
  sendMessage(){
    this.submitted = true;
    if (this.chatForm.invalid) {
      return;
    }
var topic =this.chatForm.value.topic
var msg = this.chatForm.value.msgText
    this.msgForms = {
      topic:topic,
      msgText:msg,
      teacherId: '',
      adminId: '',
      userType: 'admin',
      classId: this.studentClassId,
      schoolId: this.User.schoolId,
      isAdmin: 'false',
      staffId: '',
      chatId: '',
      FromAdminid: this.User._id,
      studentId: '',
      FromTeacherid: '',
      FromStudid: '',
      fromName: this.User.userName,
      fromImage: this.User.userImage,
      toStudentId : this.dataService._studArray._id,
      ToUser :this.dataService._studArray.studentName,
   
    }

    console.log(this.chatForm)
    var sVal = this.dataService
    this.studentDate =sVal._studArray
    console.log(this.msgForms)

    var url = 'api/teacher/addIndividualChat';
    if (this.studentDate._id) {
      this.ajaxService.postMethod(url, this.msgForms).subscribe(
        (res) => {
          this.resdata = res;
          console.log(this.resdata)
          if (this.resdata.status == true) {
            console.log(this.msgForms)
            this.msgForms={}
            this.chatForm.value.topic = ''
            this.chatForm.value.msgText = ''    
            this.chatForm.reset(
              {
                msgText: [''],
      adminId: [this.User._id],
      userType: ['admin'],
      classId: [this.dataService.studentClass['_id']],
      topic: [''],
      schoolId: [this.User.schoolId],
      isAdmin: ["false"],
      
      // chatId: [this.chatRoomId],
      FromAdminid: [this.User._id],
      studentId: [this.dataService._studArray['_id']],
      FromTeacherid: '',
      FromStudid: '',
      fromName: [this.User.userName],
      fromImage: [this.User.userImage]
              });      
            this.submitted = false;
            this.getMessages();
            this.closeModal();
          
          }   
        
        });
       
    }else{
      console.log("noooooo")
    }
  }
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }
  getMessages() {
    // console.log('hey')
    this.ajaxService.getMethod({ studentId: this.dataService.studentId }, 'api/teacher/getall').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.messages = this.resdata.data;
        console.log(this.messages)
        this.formatMessages();
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
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
  formatMessages() {
    this.messageChangeList = [];
    var schoolName = this.schoolName
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
        // if (elementVal.ToName != self.User.userName)
        //    self.messageList[index]['uName'] = elementVal.ToName;
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
          self.messageList[index]['uName'] = elementVal.ToName;
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
    console.log(this.messageNewList)
  }

  sortData() {
    return this.messageChangeList.sort((a, b) => {
      return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
    });
  }

}
