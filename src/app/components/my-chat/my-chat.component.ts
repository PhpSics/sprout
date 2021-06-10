import { Component, AfterViewInit, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  chatForm: FormGroup;
  submitted = false;
  imgUrl: any = environment.defaultUserImage;
  container: HTMLElement;
  ImgSrc: any = '';
  chatName: any = '';
  chatType: any = '';
  chatRoomId: any = '';
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  schoolName: any;
  resdatas: Object;
  teachersData: any;
  adminData: Object;
  adminId: any;
  constructor(private ajaxService: CommonfunctionService,
    private router: Router,
    private local: LocalstorageService, private dataService: DataService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.dataService)
    console.log("hai")
   
    this.User = this.local.getData('loginData');
    console.log(this.User)
    this.schoolName = this.User.additionalData[0].schoolName
   var  IdAdmin = this.User.teacherSchool
   console.log(IdAdmin)
    if (this.dataService.chatRoomId == undefined) {
      this.router.navigate(['/messages']);
      return;
    } else

      this.getMessages(this.dataService.chatRoom['chatSType']);
    this.ImgSrc = this.dataService.chatRoom['image'];
    this.chatName = this.dataService.chatRoom['cName'];
    this.chatType = this.dataService.chatRoom['chatSType'];
    this.chatRoomId = this.dataService.chatRoomId;
    if (this.dataService.chatRoom['chatSType'] == 'broadcast') {
      this.chatForm = this.formBuilder.group({
        fromName: [this.User.teacherName],
        fromImage: [this.User.teacherImage],
        broadcastId: [this.dataService.chatRoomId],
        msgText: ['', [Validators.required]],
      });
    } else if (this.dataService.chatRoom['chatSType'] == 'message') {
      
      this.chatForm = this.formBuilder.group({
        teacherId: [this.dataService.chatRoom['fromTId']],
        msgText: ['', [Validators.required]],
        adminId: [this.dataService.chatRoom['fromAId']],
        // adminId: [this.adminId],
        userType: ['teacher'],
        classId: [this.dataService.chatRoom['classId']],
        topic: '',
        schoolId: [this.User.schoolId],
        isAdmin: [this.dataService.chatRoom['isAdmin']],
        staffId: [this.dataService.chatRoom['staffId']],
        chatId: [this.dataService.chatRoomId],
        FromTeacherid: [this.User._id],
        studentId: [this.dataService.chatRoom['fromPId']],
        FromAdminid: '',
        FromStudid: '',
        fromName: [this.User.teacherName],
        fromImage: [this.User.teacherImage]
      });
      console.log(this.chatForm)
    } else if (this.dataService.chatRoom['chatSType'] == 'comment') {
      this.chatForm = this.formBuilder.group({
        homeworkMainId: [this.dataService.chatRoomId],
        commentText: ['', [Validators.required]],
        userType: 'teacher',
        subjectId: [this.dataService.chatRoom['subjectId']],
        teacherId: [this.User._id],
        fromName: [this.User.teacherName],
        fromImage: [this.User.teacherImage],
        studentId: [this.dataService.chatRoom['studentId']],
        commentTopic: [this.dataService.chatRoom['cName']],
        classId: [this.dataService.chatRoom['classId']]
      });
    }
    this.scrollToBottom();

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  keydownSubmit(event) {
    if (event.keyCode == 13) {
      // console.log('hey12')
      // this.sendChat();
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  get f() { return this.chatForm.controls; }

  getMessages(chatType) {
    var query; var url = '';
    if (chatType == 'message') {
      query = { chatRoomId: this.dataService.chatRoomId, fromUserId: this.User._id, fromUserType: 'teacher' };
      url = 'api/teacher/getchatRoomMessages';
    } else if (chatType == 'broadcast') {
      query = { broadcastId: this.dataService.chatRoomId };
      url = 'api/teacher/getbroadcastmsg';
    } else {
      query = { homeworkMainId: this.dataService.chatRoomId, fromUserId: this.User._id, fromUserType: 'teacher' };
      url = 'api/homework/homeworkcomment';
    }
    this.ajaxService.getMethod(query, url).subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.messages = this.resdata.data;
        console.log(this.messages)
        this.sortData();
        this.formatMessage();
        // console.log(this.messages)
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
  openModal(){
    var url = '';
   const buttonModal = document.getElementById("openModalButton")
  //  buttonModal.click()
  let roomId= this.dataService.chatRoomId
  console.log(roomId)
  console.log(this.dataService)

   if (this.dataService._chatRoom['chatSType'] == 'broadcast') {
    url = 'api/teacher/getRoomData';
   
    this.ajaxService.getMethod({roomId}, url).subscribe((val) => {
    this.resdatas = val;
    console.log(roomId)
    console.log( this.resdatas)
    if (this.resdatas['status'] == true) {

      if (this.resdatas['type'] == "classStudents") {
this.teachersData =this.resdatas["data"]['studentDetails']
      } 
     

    } else {
      console.log('false');
    }
  }, err => {
    console.log(err);
  });
}
 }

  formatMessage() {
    var self = this.messageList;
    var uVal = this.User;
    var sVal = this.dataService;
    var schoolnam = this.schoolName
    this.messages.forEach(function (element, index) {
      self[index] = {};
      self[index]['isAdmin'] = false;
      self[index]['createdAt'] = element.createdAt;
      if (sVal.chatRoom['chatSType'] == 'message') {
        self[index]['message'] = element.msgText;
        if (element.userType == 'admin') {
          self[index]['name'] = schoolnam
          self[index]['image'] = element.FromAdminid.userImage;
        }
        else if (element.userType == 'teacher') {
          if (element.FromTeacherid != null) {
            if (element.FromTeacherid._id == uVal._id) {
              self[index]['isAdmin'] = true;
            }
            self[index]['name'] = element.FromTeacherid.teacherName;
            self[index]['image'] = element.FromTeacherid.teacherImage;
          } else {
            if (element.senderTeacherId._id == uVal._id) {
              self[index]['isAdmin'] = true;
            }
            self[index]['name'] = element.senderTeacherId.teacherName;
            self[index]['image'] = element.senderTeacherId.teacherImage;
          }

        }
        else if (element.userType == 'parent') {
          self[index]['name'] = element.FromStudid.studentName;
          self[index]['image'] = element.FromStudid.studentImage;
        }
      } else if (sVal.chatRoom['chatSType'] == 'broadcast') {
        self[index]['isAdmin'] = true;
        self[index]['image'] = uVal.teacherImage;
        self[index]['message'] = element.msgText;
      } else {
        self[index]['message'] = element.commentText;
        self[index]['isAdmin'] = false;
        if (element.userType == 'admin') {
          self[index]['image'] = element.adminId.userImage;
          self[index]['name'] = element.adminId.userName;
        } else if (element.userType == 'parent') {
          self[index]['name'] = element.studentId.studentName;
          self[index]['image'] = element.studentId.studentImage;
        } else if (element.userType == 'teacher') {
          self[index]['isAdmin'] = true;
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
    // console.log(this.dataService.chatRoom['fromAId'])
    // console.log( this.adminId)
// if(this.dataService.chatRoom['fromAId']=="" && this.dataService.chatRoom['studentId']== ""){
//   console.log("___________8888++++++++++++++")
//   this.chatForm.value['adminId'] = this.adminId
// }
    
    console.log(this.chatForm.value)
    // this.chatForm.value.adminId = this.adminId
    if (this.dataService.chatRoom['chatSType'] == 'broadcast')
      url = 'api/teacher/addbroadcastmsg';
    else if (this.dataService.chatRoom['chatSType'] == 'message')
   
      url = 'api/teacher/addmessage';
    else url = 'api/homework/homeworkcomment';
  
    this.ajaxService.postMethod(url, this.chatForm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          if (this.dataService.chatRoom['chatSType'] == 'broadcast')
            this.chatForm.reset({ fromImage: this.User.teacherImage, fromName: this.User.teacherName, broadcastId: this.dataService.chatRoomId });
          else if (this.dataService.chatRoom['chatSType'] == 'message') {
            this.chatForm.reset({
              teacherId: this.dataService.chatRoom['fromTId'],
              msgText: '',
              adminId: this.dataService.chatRoom['fromAId'],
              userType: 'teacher',
              classId: this.dataService.chatRoom['classId'],
              topic: '',
              schoolId: this.User.schoolId,
              isAdmin: this.dataService.chatRoom['isAdmin'],
              staffId: this.dataService.chatRoom['staffId'],
              chatId: this.dataService.chatRoomId,
              FromAdminid: '',
              studentId: this.dataService.chatRoom['fromPId'],
              FromTeacherid: this.User._id,
              FromStudid: '',
              fromName: this.User.teacherName,
              fromImage: this.User.teacherImage
            });
          }
          else if (this.dataService.chatRoom['chatSType'] == 'comment') {
            this.chatForm.reset({
              homeworkMainId: this.dataService.chatRoomId,
              userType: 'teacher',
              subjectId: this.dataService.chatRoom['subjectId'],
              teacherId: this.User._id,
              fromName: this.User.teacherName,
              fromImage: this.User.teacherImage,
              studentId: this.dataService.chatRoom['studentId'],
              commentTopic: this.dataService.chatRoom['cName'],
              classId: this.dataService.chatRoom['classId']
            })
          }
          this.submitted = false;
          this.getMessages(this.dataService.chatRoom['chatSType']);
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }
}
