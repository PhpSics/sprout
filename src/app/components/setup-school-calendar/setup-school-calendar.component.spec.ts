import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupSchoolCalendarComponent } from './setup-school-calendar.component';

describe('SetupSchoolCalendarComponent', () => {
  let component: SetupSchoolCalendarComponent;
  let fixture: ComponentFixture<SetupSchoolCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupSchoolCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupSchoolCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
