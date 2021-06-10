import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-transport-attendance',
  templateUrl: './transport-attendance.component.html',
  styleUrls: ['./transport-attendance.component.css']
})
export class TransportAttendanceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

}
