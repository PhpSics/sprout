import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
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
export class AttachmentDialogComponent{
  Url: any = environment.baseUrl;
  constructor(private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AttachmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
