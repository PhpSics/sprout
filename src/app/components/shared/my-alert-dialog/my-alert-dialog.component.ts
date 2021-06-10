import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-my-alert-dialog',
  templateUrl: './my-alert-dialog.component.html',
  styleUrls: ['./my-alert-dialog.component.css']
})
export class MyAlertDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MyAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }
    onNoClick(): void {
      this.dialogRef.close();
    }
}