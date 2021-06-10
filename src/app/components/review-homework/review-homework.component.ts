import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { VideoDialogComponent } from '../../components/shared/video-dialog/video-dialog.component';
import { AttachmentDialogComponent } from '../../components/shared/attachment-dialog/attachment-dialog.component';

declare var $: any;

@Component({
  selector: 'app-review-homework',
  templateUrl: './review-homework.component.html',
  styleUrls: ['./review-homework.component.css']
})
export class ReviewHomeworkComponent implements OnInit {

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
  attachmentdata: SafeResourceUrl;
  attachmentUrl:any = '';
  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private el: ElementRef, private dataService: DataService,
    // private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog) {
    if (this.dataService.showClass == undefined) {
      this.router.navigate(['/class-management']);
      return;
    }
  }

  ngOnInit() {
    if (this.dataService.showClass == undefined || this.dataService.chatRoomId == undefined) {
      this.router.navigate(['/class-management']);
      return;
    }
    this.selHWork = this.dataService.setDataArray;
    this.User = this.local.getData('AdminloginData');
    this.commentFrm = this.formBuilder.group({
      homeworkMainId: [''],
      commentText: ['', [Validators.required]],
      userType: 'admin',
      subjectId: [this.selHWork['subject']._id],
      adminId: [this.User._id],
      fromName: [this.User.userName],
      fromImage: [this.User.userImage],
      studentId: [this.studentId, [Validators.required]],
      commentTopic: [this.selHWork['topic']],
      classId: [this.dataService.showClass],
      ToUser: ['']
    });
    this.model = {
      studAr: []
    };
    this.getHomeworks();
    console.log(this.dataService.setDataArray);
  }

  get f() { return this.commentFrm.controls; }

  openAttachment(attach) {
    let extension = attach.substr((attach.lastIndexOf('.') + 1));
    let ext = '';
    if (extension == 'jpg' || extension == 'png' || extension == 'jpeg') {
      this.attachmentUrl = this.Url + attach;
      ext = 'image';
    }
    else if (extension == 'pdf') {
      let text = `<iframe class='attachmentiframe' style=' width: 100%;height: 85vh;' src='${this.Url + attach}'></iframe>`;
      this.attachmentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.Url + attach);
      ext = 'frame';
    }
    else if (extension == 'csv' || extension == 'doc' || extension == 'docx' || extension == 'xls' || extension == 'xlsx') {
      let text = `<iframe class='attachmentiframe' style=' width: 100%;height: 85vh;' src='https://docs.google.com/gview?url=${this.Url + attach}&embedded=true'></iframe>`;
      this.attachmentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/gview?url='+this.Url + attach+'&embedded=true');
      ext = 'frame';
    }
    else if (extension == 'mp4') {
      this.attachmentUrl = this.Url + attach;
      ext = 'video';
    }
    if (extension == 'mp4') {
      const dialogRef = this.dialog.open(VideoDialogComponent, {
        width: '1000px',
        height: '950px',
        data: this.attachmentdata
      });
    }
    else {
      const dialogRef = this.dialog.open(AttachmentDialogComponent, {
        width: '1000px',
        height: '950px',
        data: {
          val:this.attachmentUrl,
          ext:ext
        }
      });
    }
    console.log(this.sanitizer.bypassSecurityTrustResourceUrl(this.attachmentUrl));
  }

  getParentAttachment(studethomeworkid) {
    console.log(studethomeworkid);
    this.router.navigate(['/homework-attachments'], { queryParams: { id: studethomeworkid } });
    // this.openAttachment(studethomeworkid);
  }

  getHomeworks() {
    this.ajaxService.getMethod({ homeworkId: this.dataService.chatRoomId }, 'api/homework/studhomework').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.homeworks = this.resdata.data;
        var i = 0;
        this.homeworks.forEach(element => {
          if (element.studentId != null) {
            this.model.studAr.push({
              _id: i,
              studentId: element.studentId._id,
              studentName: element.studentId.studentName,
              mark: element.mark,
              homeworkMainId: this.dataService.chatRoomId,
              grade: element.grade,
              fromName: this.User.userName,
              fromImage: this.User.userImage,
              stdImage: element.studentId.studentImage,
              stdHomeworkId: element._id,
              parentSignOff: element.parentSignoff,
              parentAttachment: element.parentAttachment
            })
            i++;
          }
        });
        this.StudModel = this.model.studAr;
        console.log(this.StudModel);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  submitMarks() {
    this.ajaxService.putUpMethod('api/homework/updatestudmarks', this.StudModel).subscribe(
      (res) => {
        this.resdata = res;
        if (this.resdata.status == true) {
          this.router.navigate(['/list-homework']);
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
  }

  stdComment(id, stdId, stdName) {
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
            userType: 'admin',
            subjectId: [this.selHWork['subject']._id],
            adminId: [this.User._id],
            fromName: [this.User.userName],
            fromImage: [this.User.userImage],
            commentTopic: [this.selHWork['topic']],
            classId: [this.dataService.showClass]
          });
          this.submitted = false;
          this.closeModal();
        } else {
          this.errorMessage = this.resdata.message;
        }
      }, err => {
        this.errorMessage = err;
        console.log(err);
      });
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
