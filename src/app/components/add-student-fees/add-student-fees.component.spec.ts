import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentFeesComponent } from './add-student-fees.component';

describe('AddStudentFeesComponent', () => {
  let component: AddStudentFeesComponent;
  let fixture: ComponentFixture<AddStudentFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudentFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
