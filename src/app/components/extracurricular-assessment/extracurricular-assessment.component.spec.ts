import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtracurricularAssessmentComponent } from './extracurricular-assessment.component';

describe('ExtracurricularAssessmentComponent', () => {
  let component: ExtracurricularAssessmentComponent;
  let fixture: ComponentFixture<ExtracurricularAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtracurricularAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtracurricularAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
