import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-mailbox',
  templateUrl: './create-mailbox.component.html',
  styleUrls: ['./create-mailbox.component.css']
})
export class CreateMailboxComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }

  navigateBack() {
    this._location.back();
  }
}
