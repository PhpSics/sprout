import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-teacher-performance-report',
  templateUrl: './teacher-performance-report.component.html',
  styleUrls: ['./teacher-performance-report.component.css']
})
export class TeacherPerformanceReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

}
