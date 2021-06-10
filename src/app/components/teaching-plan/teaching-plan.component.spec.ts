import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingPlanComponent } from './teaching-plan.component';

describe('TeachingPlanComponent', () => {
  let component: TeachingPlanComponent;
  let fixture: ComponentFixture<TeachingPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachingPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
