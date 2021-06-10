import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolPerformanceComponent } from './school-performance.component';

describe('SchoolPerformanceComponent', () => {
  let component: SchoolPerformanceComponent;
  let fixture: ComponentFixture<SchoolPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
