import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CommonfunctionService } from '../../../services/commonfunction.service';
import { LocalstorageService } from '../../../services/localstorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-attachment-dialog',
  templateUrl: './attachment-dialog.component.html',
  styleUrls: ['./attachment-dialog.component.css']
})
export class AttachmentDialogComponent {
  Url: any = environment.baseUrl;
  msg: any = '';
  ext: any = '';
  isLoading: Boolean = true;
  i: any = 0;
  constructor(private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AttachmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.isLoading = true;
    this.ext = this.message.ext;
    this.msg = this.message.val;
  }

  onLoad() {
    this.isLoading = false;
  }

}
