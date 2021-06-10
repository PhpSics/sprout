import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPerformanceReportComponent } from './teacher-performance-report.component';

describe('TeacherPerformanceReportComponent', () => {
  let component: TeacherPerformanceReportComponent;
  let fixture: ComponentFixture<TeacherPerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherPerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
