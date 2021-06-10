import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviouralMatrixComponent } from './behavioural-matrix.component';

describe('BehaviouralMatrixComponent', () => {
  let component: BehaviouralMatrixComponent;
  let fixture: ComponentFixture<BehaviouralMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehaviouralMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviouralMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
