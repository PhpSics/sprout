import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviouralAssessmentComponent } from './behavioural-assessment.component';

describe('BehaviouralAssessmentComponent', () => {
  let component: BehaviouralAssessmentComponent;
  let fixture: ComponentFixture<BehaviouralAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehaviouralAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviouralAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
