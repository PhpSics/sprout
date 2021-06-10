import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBehaviouralProgressComponent } from './view-behavioural-progress.component';

describe('ViewBehaviouralProgressComponent', () => {
  let component: ViewBehaviouralProgressComponent;
  let fixture: ComponentFixture<ViewBehaviouralProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBehaviouralProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBehaviouralProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
