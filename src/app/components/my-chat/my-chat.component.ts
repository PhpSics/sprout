import { Component, AfterViewInit, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-my-chat',
  templateUrl: './my-chat.component.html',
  styleUrls: ['./my-chat.component.css']
})
export class MyChatComponent implements OnInit, AfterViewChecked {
  User: any = {};
  resdata: any = {};
  messages: any = [];
  messageList: any = [];
  messageNewList: any = [];
  errorMessage: any = '';
  Url: any = environment.baseUrl;
  attachmentForm: FormGroup;
  chatForm: FormGroup;
  submitted = false;
  imgUrl: any = environment.defaultUserImage;
  container: HTMLElement;
  ImgSrc:any = '';
  chatName:any = '';
  chatType:any = '';
  chatRoomId: any = '';
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  RoomId: string;
  resdatas: Object;
  teachersData: any;
  responceData: any;
  studentData: any;
  constructor(private ajaxService: CommonfunctionService,
    public dialog: MatDialog,
    private router: Router,
    private local: LocalstorageService, private dataService: DataService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    if (this.dataService.chatRoomId == undefined) {
      this.router.navigate(['/my-messages']);
      return;
    } else
      this.getMessages(this.dataService.chatType);
    this.ImgSrc = this.dataService.setImage;
    this.chatName = this.dataService.setName;
    this.chatType = this.dataService.chatType;
    this.chatRoomId = this.dataService.chatRoomId;
    if (this.dataService.chatType == 'broadcast') {
      this.chatForm = this.formBuilder.group({
        fromName: [this.User.userName],
        fromImage: [this.User.userImage],
        broadcastId: [this.dataService.chatRoomId],
        msgText: ['', [Validators.required]],
      });
    } else if (this.dataService.chatType == 'message') {
      this.chatForm = this.formBuilder.group({
        teacherId: [this.dataService.showFee['fromTId']],
        msgText: ['', [Validators.required]],
        adminId: [this.dataService.showFee['fromAId']],
        userType: ['admin'],
        classId: [this.dataService.showFee['classId']],
        topic: '',
        schoolId: [this.User.schoolId],
        isAdmin: [this.dataService.showFee['isAdmin']],
        staffId: [this.dataService.showFee['staffId']],
        chatId: [this.dataService.chatRoomId],
        FromAdminid: [this.User._id],
        studentId: [this.dataService.showFee['studentId']],
        FromTeacherid: '',
        FromStudid: '',
        fromName: [this.User.userName],
        fromImage: [this.User.userImage]
      });
    } else if (this.dataService.chatType == 'comment') {
      this.chatForm = this.formBuilder.group({
        homeworkMainId: [this.dataService.chatRoomId],
        commentText: ['', [Validators.required]],
        userType: 'admin',
        subjectId: [this.dataService.showFee['subjectId']],
        adminId: [this.User._id],
        fromName: [this.User.userName],
        fromImage: [this.User.userImage],
        studentId: [this.dataService.showFee['studentId']],
        commentTopic: [this.dataService.setName],
        classId: [this.dataService.showFee['classId']]
      });
    }
    this.scrollToBottom();

    this.attachmentForm = this.formBuilder.group({
      message: ['', [Validators.required]],
    });
  }

  sendMessage() {

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
   openModal(){
    var url = '';
   const buttonModal = document.getElementById("openModalButton")
  //  buttonModal.click()
  let roomId= this.dataService.chatRoomId
   if (this.dataService.chatType == 'broadcast') {
    url = 'api/teacher/getRoomData';
   
    this.ajaxService.getMethod({roomId}, url).subscribe((val) => {
    this.resdatas = val;
    if (this.resdatas['status'] == true) {

      if (this.resdatas['type'] == "classStudents") {
this.teachersData =this.resdatas["data"]['studentDetails']
      } else if (this.resdatas['type'] == "teacher") {
        this.teachersData =this.resdatas["data"]['teacherDetails']
              } 
      // else if  (this.resdatas['type'] == "class students") {
      //   this.responceData =this.resdatas["data"]['studentDetails']
      //   console.log(this.responceData)
      //         }
//               console.log(this.responceData)
//            if(this.responceData){
// console.log("eeeeeeeeee")

      
//            }   

    } else {
      console.log('false');
    }
  }, err => {
    console.log(err);
  });
}
 }

  keydownSubmit(event){
    if(event.keyCode == 13){
      // console.log('hey12')
      // this.sendChat();
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  get f() {
    // console.log(this.chatForm.controls) 
    return this.chatForm.controls; }

  getMessages(chatType) {
    var query; var url = '';
    if (chatType == 'message') {
      query = { chatRoomId: this.dataService.chatRoomId, fromUserId: this.User._id, fromUserType: 'admin' };
      url = 'api/teacher/getchatRoomMessages';
    } else if (chatType == 'broadcast') {
      query = { broadcastId: this.dataService.chatRoomId };
      url = 'api/teacher/getbroadcastmsg';
    } else {
      query = { homeworkMainId: this.dataService.chatRoomId, fromUserId: this.User._id, fromUserType: 'admin' };
      url = 'api/homework/homeworkcomment';
    }
    this.ajaxService.getMethod(query, url).subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.messages = this.resdata.data;
        this.sortData();
        this.formatMessage();
       
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  sortData() {
    return this.messages.sort((a, b) => {
      return <any>new Date(a.createdAt) - <any>new Date(b.createdAt);
    });
  }

  formatMessage() {
    var self = this.messageList;
    var uVal = this.User;

    var sVal = this.dataService;
    this.messages.forEach(function (element, index) {
      self[index] = {};
      self[index]['isAdmin'] = false;
      self[index]['createdAt'] = element.createdAt;
      if (sVal.chatType == 'message') {
        self[index]['message'] = element.msgText;
        if (element.userType == 'admin') {
          if (element.FromAdminid._id == uVal._id) {
            self[index]['isAdmin'] = true;
          }
          self[index]['image'] = element.FromAdminid.userImage;
        }
        else if (element.userType == 'teacher') {
          self[index]['name'] = element.FromTeacherid.teacherName;
          self[index]['image'] = element.FromTeacherid.teacherImage;
        }
        else if (element.userType == 'parent') {
          self[index]['name'] = element.FromStudid.studentName;
          self[index]['image'] = element.FromStudid.studentImage;
        }
      } else if (sVal.chatType == 'broadcast') {
        self[index]['isAdmin'] = true;
        self[index]['image'] = uVal.userImage;
        self[index]['message'] = element.msgText;
      } else {
        self[index]['message'] = element.commentText;
        self[index]['isAdmin'] = false;
        if (element.userType == 'admin') {
          self[index]['isAdmin'] = true;
          self[index]['name'] = element.adminId.userName;
          self[index]['image'] = element.adminId.userImage;
        } else if (element.userType == 'parent') {
          self[index]['name'] = element.studentId.studentName;
          self[index]['image'] = element.studentId.studentImage;
        } else if (element.userType == 'teacher') {
          self[index]['name'] = element.teacherId.teacherName;
          self[index]['image'] = element.teacherId.teacherImage;
        }
      }
    });
    this.messageNewList = self;
  }

  sendChat() {
    // console.log('hey');
    this.submitted = true;
    var url = '';
    if (this.chatForm.invalid) {
      return;
    }
    if (this.dataService.chatType == 'broadcast'){
      console.log("------broadcast------")
      url = 'api/teacher/addbroadcastmsg';
    }
    else if (this.dataService.chatType == 'message'){
      console.log("------message------")
      url = 'api/teacher/addmessage';
    }
    else url = 'api/homework/homeworkcomment';
    
    this.ajaxService.postMethod(url, this.chatForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          if (this.dataService.chatType == 'broadcast')
            this.chatForm.reset({ fromImage: this.User.userImage, fromName: this.User.userName, broadcastId: this.dataService.chatRoomId });
          else if (this.dataService.chatType == 'message') {
            this.chatForm.reset({
              teacherId: this.dataService.showFee['fromTId'],
              msgText: '',
              adminId: this.dataService.showFee['fromAId'],
              userType: 'admin',
              classId: this.dataService.showFee['classId'],
              topic: '',
              schoolId: this.User.schoolId,
              isAdmin: this.dataService.showFee['isAdmin'],
              staffId: this.dataService.showFee['staffId'],
              chatId: this.dataService.chatRoomId,
              FromAdminid: this.User._id,
              studentId: this.dataService.showFee['fromPId'],
              FromTeacherid: '',
              FromStudid: '',
              fromName: this.User.userName,
              fromImage: this.User.userImage
            });
          }
          else if (this.dataService.chatType == 'comment') {
            this.chatForm.reset({
              homeworkMainId: this.dataService.chatRoomId,
              userType: 'admin',
              subjectId: this.dataService.showFee['subjectId'],
              adminId: this.User._id,
              fromName: this.User.userName,
              fromImage: this.User.userImage,
              studentId: this.dataService.showFee['studentId'],
              commentTopic: this.dataService.setName,
              classId: this.dataService.showFee['classId']
            })
          }
          this.submitted = false;
          this.getMessages(this.dataService.chatType);
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }
}
 