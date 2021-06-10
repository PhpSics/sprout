import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventManagementComponent } from './calendar-event-management.component';

describe('CalendarEventManagementComponent', () => {
  let component: CalendarEventManagementComponent;
  let fixture: ComponentFixture<CalendarEventManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
