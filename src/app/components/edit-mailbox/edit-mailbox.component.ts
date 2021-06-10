import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-mailbox',
  templateUrl: './edit-mailbox.component.html',
  styleUrls: ['./edit-mailbox.component.css']
})
export class EditMailboxComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }

  navigateBack() {
    this._location.back();
  }

}
