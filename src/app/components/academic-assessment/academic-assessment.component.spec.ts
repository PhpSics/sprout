import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicAssessmentComponent } from './academic-assessment.component';

describe('AcademicAssessmentComponent', () => {
  let component: AcademicAssessmentComponent;
  let fixture: ComponentFixture<AcademicAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
