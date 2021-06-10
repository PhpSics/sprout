import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ViewChild, ElementRef } from '@angular/core';
import { MyAlertDialogComponent } from '../../components/shared/my-alert-dialog/my-alert-dialog.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  User: any = {};
  searchText: any = '';
  resdata: any = [];
  messages: any = [];
  messageChangeList: any = [];
  messageList: any = [];
  classes: any = [];
  teachers: any = [];
  teacherList: any = [];
  classList: any = [];
  staffList: any = [];
  staffs: any = [];
  messageNewList: any = [];
  Url: any = environment.baseUrl;
  dropdownSettings = {};
  dropdownSettings1 = {};
  staffSettings = {};
  studentSettings = {};
  msgForm: FormGroup; 
  classnewList: any = [];
  classnewLists: any = [];
  classVal: any = [];
  submitted: any = false;
  student: any = [];
  studentList: any = [];
  schoolName: any;
  stdfullName: any;
  fullName: any = [];
  constructor(private ajaxService: CommonfunctionService,
    private router: Router,
    private local: LocalstorageService, private dataService: DataService,
    private formBuilder: FormBuilder, private el: ElementRef,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.User = this.local.getData('AdminloginData');
    // console.log(this.User)
    this.schoolName = this.User.schooldetails[0].schoolName
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
      fromName: [this.User.schooldetails[0].schoolName],
      fromImage: [this.User.userImage]
    });
    this.getMessages();
    this.getTeachers();
    this.getClass();
    this.getStaffs();
    this.getStudent();
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'teacherName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: '_id',
      textField: 'className',
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
    this.studentSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'AdditionalData',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  getStudent() {
    
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/student').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.student = this.resdata.data;
    
      for (let i = 0; i < this.student.length; i++) {
        var stcls = this.student[i].studentClass.className
          var stdstm = this.student[i].studentStream.streamName
        var stdname = this.student[i].studentName
        this.fullName = stdname + " - " + stcls +" " +stdstm
        // this.fullName = stdname + " " + stcls + stdstm
        this.student[i]['AdditionalData'] = this.fullName;
      }
      
      // console.log(this.student)
      } else {
        // console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }
  getClass() {
    this.ajaxService.getMethod({ school: this.User.schoolId }, 'api/class/classtream').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.classes = this.resdata.data;
        var self = this;
       
        this.classes.forEach(function (element, index) {
          self.classnewList[index] = [];
          self.classnewList[index]['className'] = element.classId.className + ' ' + element.streamName;
          self.classnewList[index]['_id'] = element.classId._id + '-' + element._id;
        });
        this.classnewLists = self.classnewList;
      
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

  getMessages() {
   
    this.ajaxService.getMethod({ adminId: this.User._id }, 'api/teacher/getall').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.messages = this.resdata.data;
       
        this.formatMessages();
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  get f() { return this.msgForm.controls; }

  onSelectAll(items: any, type) {
    if (type == 'teacher') {
      this.teacherList = [];
      items.forEach(element => {
        this.teacherList.push(element._id);
      });
    } else if (type == 'class') {
      this.classList = [];
      items.forEach(element => {
        this.classList.push(element._id);
      });
    } else if (type == 'staff') {
      this.staffList = [];
      items.forEach(element => {
        this.staffList.push(element._id);
      });
    }else if (type == 'student') {
      this.studentList = [];
      items.forEach(element => {
        this.studentList.push(element._id);
      });
    }
  }

  onItemSelect(items: any, type) {
    if (type == 'teacher') {
      this.teacherList.push(items._id);
    } else if (type == 'class') {
      this.classList.push(items._id);
    } else if (type == 'staff') {
      this.staffList.push(items._id);
    }else if (type == 'student') {
      this.studentList.push(items._id);
    
    }
  }
  onItemDeselect(items: any, type) {
    if (type == 'teacher') {
      var index = this.teacherList.indexOf(items._id);
      if (index > -1) {
        this.teacherList.splice(index, 1);
      }
    } else if (type == 'class') {
      var index1 = this.classList.indexOf(items._id);
      if (index1 > -1) {
        this.classList.splice(index1, 1);
      }
    } else if (type == 'staff') {
      var index2 = this.staffList.indexOf(items._id);
      if (index2 > -1) {
        this.staffList.splice(index2, 1);
      }
    }else if (type == 'student') {
      var index3 = this.studentList.indexOf(items._id);
      if (index3 > -1) {
        this.studentList.splice(index3, 1);
      }
    }
  }

  onDeSelectAll(items: any, type) {
    if (type == 'teacher') {
      this.teacherList = [];
    } else if (type == 'class') {
      this.classList = [];
    } else if (type == 'staff') {
      this.staffList = [];
    }else if (type == 'student') {
      this.studentList = [];
    }
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
            self.messageList[index]['viewStatus'] = elementVal.viewStatus;
            self.messageList[index]['image'] = elementVal.FromTeacherid.teacherImage;
            self.messageList[index]['fromTId'] = elementVal.FromTeacherid._id;
            if (self.messageList[index]['uName'] == '')
              self.messageList[index]['uName'] = elementVal.FromTeacherid.teacherName;
          }
        }
        if (elementVal.userType == "parent") {
      
          if (elementVal.FromStudid != null) {
            self.messageList[index]['viewStatus'] = elementVal.viewStatus;

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
            self.messageList[index]['uName'] = elementVal.toTeacherImg.teacherName;
            // console.log(self.messageList[index]['uName'])
            if (self.messageList[index]['uName'] == '')
              self.messageList[index]['uName'] = elementVal.toTeacherImg.teacherName;
          }
          if (elementVal.toStudentImg != null) {           
            self.messageList[index]['image'] = elementVal.toStudentImg.studentImage;
            self.messageList[index]['uName'] = elementVal.toStudentImg.studentName;
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
         
          self.messageList.splice(index, 1);
        }
      }
    });
    this.messageNewList = self.messageList;
   
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

  sendMessage() {
    this.submitted = true;
    if (this.msgForm.invalid) {
      return;
    }
    var cls = '';
    this.classList.forEach(element => {
      cls = element.split('-');
      var f = { "classId": cls[0], "streamId": cls[1] };
      this.classVal.push(f);
    });
    this.msgForm.value.studentId = this.studentList.join();
    this.msgForm.value.classId = JSON.stringify(this.classVal);
    this.msgForm.value.teacherId = this.teacherList.join();
    this.msgForm.value.staffId = this.staffList.join();
    
    if (this.classList.length == 0 && this.teacherList.length == 0 && this.staffList.length == 0 && this.studentList.length == 0) {
      let dialogRef1 = this.dialog.open(MyAlertDialogComponent, {
        width: '350px',
        data: "Please Select a Recipient!"
      });
      dialogRef1.afterClosed().subscribe(result => {
      });
      return; 
    }
    var url = 'api/teacher/createbroadcast'; 
    if (this.classList.length == 0 && this.teacherList.length == 1 && this.studentList.length == 0 ) {
      this.msgForm.value.classId = '';
      var url = 'api/teacher/addmessage';
    }else if (this.classList.length == 0 && this.teacherList.length ==0&& this.studentList.length ==1 ) {
      this.msgForm.value.classId = '';
      var url = 'api/teacher/addmessage';
    }
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
              fromName: this.User.userName,
              fromImage: this.User.userImage
            });
          this.teacherList = [];
          this.classList = [];
          this.classVal = [];
          this.staffList = [];
          this.studentList = [];
          this.getMessages();
          this.closeModal();
        }
      });
  }

  //call this wherever you want to close modal
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

}
