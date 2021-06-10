import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAttendanceComponent } from './transport-attendance.component';

describe('TransportAttendanceComponent', () => {
  let component: TransportAttendanceComponent;
  let fixture: ComponentFixture<TransportAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
