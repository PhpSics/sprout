import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-school-performance',
  templateUrl: './school-performance.component.html',
  styleUrls: ['./school-performance.component.css']
})
export class SchoolPerformanceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

}
