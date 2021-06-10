import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAcademicAssessmentComponent } from './review-academic-assessment.component';

describe('ReviewAcademicAssessmentComponent', () => {
  let component: ReviewAcademicAssessmentComponent;
  let fixture: ComponentFixture<ReviewAcademicAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewAcademicAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAcademicAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
