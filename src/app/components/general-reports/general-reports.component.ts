import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-general-reports',
  templateUrl: './general-reports.component.html',
  styleUrls: ['./general-reports.component.css']
})
export class GeneralReportsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

}
