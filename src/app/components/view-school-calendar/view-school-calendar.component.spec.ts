import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSchoolCalendarComponent } from './view-school-calendar.component';

describe('ViewSchoolCalendarComponent', () => {
  let component: ViewSchoolCalendarComponent;
  let fixture: ComponentFixture<ViewSchoolCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSchoolCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSchoolCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
