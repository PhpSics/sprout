import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviouralProgressComponent } from './behavioural-progress.component';

describe('BehaviouralProgressComponent', () => {
  let component: BehaviouralProgressComponent;
  let fixture: ComponentFixture<BehaviouralProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehaviouralProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviouralProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
