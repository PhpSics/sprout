import { Component, OnInit } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AttachmentDialogComponent } from '../../components/shared/attachment-dialog/attachment-dialog.component';
import { VideoDialogComponent } from '../../components/shared/video-dialog/video-dialog.component';

@Component({
  selector: 'app-homework-attachments',
  templateUrl: './homework-attachments.component.html',
  styleUrls: ['./homework-attachments.component.css']
})
export class HomeworkAttachmentsComponent implements OnInit {
  Url: any = environment.baseUrl;
  selHWork = {};
  homeworkId: any = '';
  Atmodel1: any = {};
  studenthomeworkId: any = '';
  resdata: any = {};
  attachments: any = [];
  attachmentUrl:any = '';
  attachmentdata: SafeResourceUrl;

  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private el: ElementRef, private dataService: DataService, private sanitizer: DomSanitizer,
    public route: ActivatedRoute,
    // private _snackBar: MatSnackBar,
    public dialog: MatDialog) {
    // if (this.dataService.classId == undefined || this.dataService.classId == '') {
    //   this.router.navigate(['/homework']);
    //   return;
    // }
  }

  ngOnInit() {
    // if (this.dataService.classId == undefined || this.dataService.classId == '') {
    //   this.router.navigate(['/homework']);
    //   return;
    // }
    this.studenthomeworkId = this.route.snapshot.queryParamMap.get('id');
    this.selHWork = this.dataService.setDataArray;
    this.homeworkId = this.selHWork['_id'];
    console.log('stud id = ' + this.studenthomeworkId);
    this.getStudentHomeworkattachments();
  }

  getStudentHomeworkattachments() {
    this.ajaxService.getMethod({ studenthomeworkId: this.studenthomeworkId }, 'api/homework/getParenthomeworkAttachments').subscribe((val) => {
      this.resdata = val;
      if (this.resdata.status == true) {
        this.attachments = this.resdata.data[0].parentAttachment;

        console.log(this.attachments);
      } else {
        console.log('false');
      }
    }, err => {
      console.log(err);
    });
  }

  download(url, attach) {
    console.log('url:', url);
    console.log('attach:', attach);

    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, authToken');
    headers.append('Access-Control-Allow-Credentials', 'true');

    const fileName = attach.split('/')[1];

    this.http.get(url + attach, {
      responseType: 'arraybuffer', headers: headers
    })
      .subscribe((res) => {

        this.downloadFile(res, fileName, ''); // file extension

      });
  }

  downloadFile(content, fileName, contentType) {
    const a = document.createElement('a');
    // const file = new Blob([content], {type: contentType});
    const file = new Blob([content]);
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

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

}
