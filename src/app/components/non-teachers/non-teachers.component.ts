import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-non-teachers',
  templateUrl: './non-teachers.component.html',
  styleUrls: ['./non-teachers.component.css']
})
export class NonTeachersComponent implements OnInit {
  show: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  addStudent(showval){
    this.show = showval;
  }
}
