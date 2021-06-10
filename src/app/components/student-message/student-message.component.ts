import { Component, AfterViewInit, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { DataService } from '../../services/data.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators ,AbstractControl} from '@angular/forms';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-message',
  templateUrl: './student-message.component.html',
  styleUrls: ['./student-message.component.css']
})
export class StudentMessageComponent implements OnInit {
  studentName: any = {};
  chatForm: FormGroup;
  msgText:AbstractControl;
  searchText: any = '';
  attachmentForm: FormGroup;
  errorMessage: any = '';
  studentImage:any = {};
  Url: any = environment.baseUrl;
  studentClassId: any = {};
  messages: any;
  User: any;
  studentDate: any;
  msgForm: any;
  resdata: any;
  chatType = 'message'
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  roomMessages: any;
  messageList: any = [];
  messageNewList: any = [];
  chatRoomId: any;
  messageNew: any = [];
  msgForms: any = [];
  submitted = false;
  constructor( private dataService: DataService,
    private local: LocalstorageService,
    private router: Router,
    private ajaxService: CommonfunctionService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    console.log(this.dataService)

    if (this.dataService.studentId == undefined) {
      this.router.navigate(['/student-profile']);
      return;
    } else

    this.studentName = this.dataService.studentName;
      this.studentImage = this.dataService._studentImage;
      this.studentClassId = this.dataService._studArray.studentClass._id;
      console.log(this.studentImage)
    this.getMessages()
    console.log(this.chatRoomId)
    this.chatForm = this.formBuilder.group({
     
      msgText: ['', [Validators.required]],
        adminId: [this.User._id],
      userType: ['admin'],
      classId: [this.dataService.studentClass['_id']],
      topic: '',
      schoolId: [this.User.schoolId],
      isAdmin: ["true"],
      
      chatId: [this.chatRoomId],
      FromAdminid: [this.User._id],
      studentId: [this.dataService._studArray['_id']],
      FromTeacherid: '',
      FromStudid: '',
      fromName: [this.User.userName],
      fromImage: [this.User.userImage]

    });
      
   console.log(this.chatForm)
    
    this.scrollToBottom();
    
  }
 

getMessage(){
  
  //  if (chatType == 'message') {
  //     query = { chatRoomId: this.dataService.chatRoomId, fromUserId: this.User._id, fromUserType: 'admin' };
  //     url = 'api/teacher/getchatRoomMessages';
  //   }
  
}
ngAfterViewChecked() {
  this.scrollToBottom();
}
  createRoom() {
    this.msgForms = {
      
      teacherId: '',
      adminId: '',
      userType: 'admin',
      classId: this.studentClassId,
      schoolId: this.User.schoolId,
      isAdmin: 'true',
      staffId: '',
      chatId: '',
      FromAdminid: this.User._id,
      studentId: '',
      FromTeacherid: '',
      FromStudid: '',
      fromName: this.User.userName,
      fromImage: this.User.userImage,
      toStudentId : this.dataService._studArray._id,
      ToUser :this.dataService._studArray._id
    }
    console.log(this.msgForms)
    var sVal = this.dataService
    this.studentDate =sVal._studArray
    console.log(this.studentDate)

    var url = 'api/teacher/addIndividualChat';
    if (this.studentDate._id) {
      console.log("sssssss")
      this.ajaxService.postMethod(url, this.msgForms).subscribe(
        (res) => {
          this.resdata = res;
          console.log(this.resdata)
          if (this.resdata.status == true) {
           
             
            this.msgForms = ""
            console.log(this.msgForms)
          }    
        });
       
    }else{
      console.log("noooooo")
    }
    // this.getMessages()
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  get f() {
    console.log(this.chatForm.controls) 
    return this.chatForm.controls; }
  
sendChat(){
  this.submitted = true;
  
  if (this.chatForm.invalid) {
    return;
  }
  if(this.dataService._studArray._id!= undefined){
  if (this.chatRoomId) {
    var url = 'api/teacher/addmessage';
    this.chatForm.value['chatId'] = this.chatRoomId
    console.log(this.chatForm.value)
    this.ajaxService.postMethod(url, this.chatForm.value).subscribe(
      (res) => {
        this.resdata = res;
        console.log(this.resdata)
        
        if (this.resdata.status == true) {
          this.chatForm.reset({
       
            msgText: '',
            adminId: [this.User._id],
            userType: 'admin',
            classId: [this.dataService.studentClass['_id']],
            topic: '',
            schoolId: this.User.schoolId,
            isAdmin: ["true"],
           
            chatId:  this.chatRoomId,
            FromAdminid: this.User._id,
            studentId: [this.dataService._studArray['_id']],
            FromTeacherid: '',
            FromStudid: '',
            fromName: this.User.userName,
            fromImage: this.User.userImage
          });
          this.submitted = false;
          this.getMessages()

        }else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }
}
}
getMessages() {

  if(this.dataService._studArray._id!= undefined){
  this.ajaxService.getMethod({ studentId : this.dataService._studArray._id }, 'api/teacher/getall').subscribe((val) => {
    this.resdata = val;
    if (this.resdata.status == true) {
      this.messages = this.resdata.data;
     
 if(this.messages.Messages.length > 0){
   console.log(this.messages)
    this.chatRoomId = this.messages.Messages[0].chatRoomId
   
    console.log(this.chatRoomId)
  var  query = { chatRoomId: this.chatRoomId, fromUserId: this.User._id, fromUserType: 'admin' };
   var  url = 'api/teacher/getchatRoomMessages';
   this.ajaxService.getMethod(query, url).subscribe((val) => {
    this.resdata = val;
    if (this.resdata.status == true) {
      this.roomMessages = this.resdata.data;
      console.log(this.roomMessages)
      this.formatMessage()
    } else {
      console.log('false');
    }
  }, err => {
    console.log(err);
  });


 }else{
  console.log("nooooooo")
  console.log(this.chatRoomId)
 this.createRoom()
 }

    } 
  }, err => {
    console.log(err);
  });
}
}
keydownSubmit(event){
  console.log("hhhhhhhhh")
  if(event.keyCode == 13){
    // console.log('hey12')

  }
}
formatMessage(){

  var self = this.messageList;
  var sVal = this.dataService;
  var uVal = this.User;
  this.roomMessages.forEach(function (element, index) {

    self[index] = {};
    self[index]['isAdmin'] = false;
        self[index]['createdAt'] = element.createdAt;
  
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
    
  });
  this.messageNewList = self;
 
  console.log( this.messageNewList )
  // for (var i = this.messageNewList.length; i > 0; --i) {
  //   console.log(this.messageNewList[i])
  //   // var list = list.push(this.messageNewList[i])
  // }
}


}
