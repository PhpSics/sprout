import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolCurriculumManagementComponent } from './school-curriculum-management.component';

describe('SchoolCurriculumManagementComponent', () => {
  let component: SchoolCurriculumManagementComponent;
  let fixture: ComponentFixture<SchoolCurriculumManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolCurriculumManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolCurriculumManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
