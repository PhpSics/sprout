import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAssessmentComponent } from './general-assessment.component';

describe('GeneralAssessmentComponent', () => {
  let component: GeneralAssessmentComponent;
  let fixture: ComponentFixture<GeneralAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
