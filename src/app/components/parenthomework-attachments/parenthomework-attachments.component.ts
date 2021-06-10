import { Component, OnInit, SecurityContext } from '@angular/core';
import { CommonfunctionService } from '../../services/commonfunction.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AttachmentDialogComponent } from '../../components/shared/attachment-dialog/attachment-dialog.component';
import { VideoDialogComponent } from '../../components/shared/video-dialog/video-dialog.component';
declare var $: any;
@Component({
  selector: 'app-parenthomework-attachments',
  templateUrl: './parenthomework-attachments.component.html',
  styleUrls: ['./parenthomework-attachments.component.css']
})
export class ParenthomeworkAttachmentsComponent implements OnInit {
  Url: any = environment.baseUrl;
  selHWork = {};
  homeworkId:any = '';
  Atmodel1: any = {};
  studenthomeworkId:any = '';
  resdata: any = {};
  attachments: any = [];
  attachmentdata: SafeResourceUrl;
  //user_photo: SafeResourceUrl;
  // attachmentdata: string;

  constructor(private ajaxService: CommonfunctionService,
    private local: LocalstorageService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private el: ElementRef, private dataService: DataService,private sanitizer: DomSanitizer,
    public route: ActivatedRoute,
    private _snackBar: MatSnackBar,public dialog: MatDialog) {
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
    this. studenthomeworkId = this.route.snapshot.queryParamMap.get('id');
    this.selHWork = this.dataService.setDataArray;
    this.homeworkId = this.selHWork['_id'];
    console.log('stud id = '+this. studenthomeworkId);
    this.getStudentHomeworkattachments();

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
      responseType: 'arraybuffer', headers: headers} )
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

}
