import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { VideoDialogComponent } from '../../components/shared/video-dialog/video-dialog.component';
import { AttachmentDialogComponent } from '../../components/shared/attachment-dialog/attachment-dialog.component';

declare var $: any;

@Component({
  selector: 'app-mark-homework',
  templateUrl: './mark-homework.component.html',
  styleUrls: ['./mark-homework.component.css']
})
export class MarkHomeworkComponent implements OnInit {

  @ViewChild('closeBtn') closeBtn: ElementRef;
  homeworkForm: FormGroup;
  User: any = {};
  resdata: any = {};
  submitted: boolean = false;
  Url: any = environment.baseUrl;
  class: any = [];
  streams: any = [];
  subjects: any = [];
  streamId: any = '';
  classId: any = '';
  homeworks: any = [];
  ImgUrl = environment.defaultUserImage;
  model: any = {};
  StudModel: any = [];
  errorMessage: any = '';
  selHWork = {};
  studentId: any = '';
  commentFrm: FormGroup;
  homeworkId:any = '';
  studentHomeworkid:any = '';
  permissionList:any = [];
  pList:any = [];
  pLists:any = [];
  roles:any = [];
  attachmentdata: SafeResourceUrl;
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private el: ElementRef, private dataService: DataService,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog) {
    if (this.dataService.classId == undefined || this.dataService.classId == '') {
      this.router.navigate(['/homework']);
      return;
    }
  }

  ngOnInit() {
    if (this.dataService.classId == undefined || this.dataService.classId == '') {
      this.router.navigate(['/homework']);
      return;
    }
    this.selHWork = this.dataService.setDataArray;
    this.homeworkId = this.selHWork['_id'];
    this.User = this.local.getData('loginData');
    this.commentFrm = this.formBuilder.group({
      homeworkMainId: [''],
      commentText: ['', [Validators.required]],
      userType: 'teacher',
      subjectId: [this.selHWork['subject']._id],
      teacherId: [this.User._id],
      fromName: [this.User.teacherName],
      fromImage: [this.User.teacherImage],
      studentId: [this.studentId, [Validators.required]],
      commentTopic: [this.selHWork['topic']],
      classId: [this.dataService.classId],
      ToUser:['']
    });
    this.model = {
      studAr: []
    };
    this.getPermission();
    this.getHomeworks();
    //console.log(this.dataService.setDataArray);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
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
          // console.log(this.pList);
          this.dataService.permissionList = this.pList;
          this.pLists = this.pList;
        } else {
         // console.log('false');
        }
      }, err => {
        //console.log(err);
      });
    } else {
      this.dataService.permissionList = [];
      this.pLists = [];
    }
  }

  get f() { return this.commentFrm.controls; }

  getHomeworks() {
    this.ajaxService.getMethod({ homeworkId: this.homeworkId }, 'api/homework/studhomework').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.homeworks = this.resdata.data;
        var i = 0;
        this.homeworks.forEach(element => {
          this.model.studAr.push({
            _id: i,
            studentId: element.studentId._id,
            studentName: element.studentId.studentName,
            mark: element.mark,
            homeworkMainId: this.homeworkId,
            grade: element.grade,
            fromName: this.User.teacherName,
            fromImage: this.User.teacherImage,
            stdImage: element.studentId.studentImage,
            stdHomeworkId: element._id,
            parentSignOff: element.parentSignoff,
            parentAttachment: element.parentAttachment
          })
          i++;
        });
        this.StudModel = this.model.studAr;
         console.log(this.StudModel);
      } else {
       // console.log('false');
      }
    }, err => {
     // console.log(err);
    });
  }

  submitMarks() {
    this.ajaxService.putUpMethod('api/homework/updatestudmarks', this.StudModel).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.router.navigate(['/review-homework']);
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        //console.log(err);
      });
  }

  stdComment(id,stdId,stdName) {
    this.commentFrm.controls.studentId.setValue(id);
    this.commentFrm.controls.homeworkMainId.setValue(stdId);
    this.commentFrm.controls.ToUser.setValue(stdName);
  }

  sendComment() {
    this.submitted = true;
    if (this.commentFrm.invalid) {
      return;
    }
    this.ajaxService.postMethod('api/homework/homeworkcomment', this.commentFrm.value).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.commentFrm.reset({
            userType: 'teacher',
            subjectId: [this.selHWork['subject']._id],
            teacherId: [this.User._id],
            fromName: [this.User.teacherName],
            fromImage: [this.User.teacherImage],
            commentTopic: [this.selHWork['topic']],
            classId: [this.dataService.classId]
          });
          this.submitted = false;
          this.closeModal();
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        //console.log(err);
      });
  }

  //Get parent attachment
  getParentAttachment(studethomeworkid){
    this.router.navigate(['/parenthomework-attachments'],{queryParams:{id:studethomeworkid}});
    // this.openAttachment(studethomeworkid);
  }

  openAttachment(attach)
  {
       let extension=attach.substr((attach.lastIndexOf('.') + 1));
        if(extension=='jpg' || extension=='png' || extension=='jpeg')
        {
            this.attachmentdata=`<img class="attachment" src="${this.Url+attach}" width="100%">`;
        }
        else if(extension=='pdf')
        {
          let text=`<iframe class='attachmentiframe' style=' width: 100%;height: 85vh;' src='${this.Url+attach}'></iframe>`;
          this.attachmentdata= this.sanitizer.bypassSecurityTrustHtml(text);
        }
        else if(extension=='csv' || extension=='doc' || extension=='docx' || extension=='xls'|| extension=='xlsx')
        {
          // const newLocal = `https://docs.google.com/gview?url=${this.Url+attach}&embedded=true`;
          // this.attachmentdata= this.sanitizer.bypassSecurityTrustResourceUrl(newLocal);
            let text=`<iframe class='attachmentiframe' style=' width: 100%;height: 85vh;' src='https://docs.google.com/gview?url=${this.Url+attach}&embedded=true'></iframe>`;
            this.attachmentdata = this.sanitizer.bypassSecurityTrustHtml(text);
        }
        else if(extension=='mp4')
        {
          this.attachmentdata= this.Url+attach;
            // let text='<mat-video class="attachmentiframe" src="http://static.videogular.com/assets/videos/videogular.mp4" ></mat-video>';
            // this.attachmentdata = this.sanitizer.bypassSecurityTrustHtml(text);
        }
        if(extension=='mp4'){
          const dialogRef = this.dialog.open(VideoDialogComponent, {
                  width: '1000px',
                  height: '950px',
                  data:   this.attachmentdata
                });
        }
        else
        {
          const dialogRef = this.dialog.open(AttachmentDialogComponent, {
                              width: '1000px',
                              height: '950px',
                              data:   this.attachmentdata
                            });
        }
     console.log(this.attachmentdata);
  }

  //call this wherever you want to close modal
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
}
