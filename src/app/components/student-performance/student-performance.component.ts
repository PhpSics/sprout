import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-student-performance',
  templateUrl: './student-performance.component.html',
  styleUrls: ['./student-performance.component.css']
})
export class StudentPerformanceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

}
