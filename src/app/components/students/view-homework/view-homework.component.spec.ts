import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHomeworkComponent } from './view-homework.component';

describe('ViewHomeworkComponent', () => {
  let component: ViewHomeworkComponent;
  let fixture: ComponentFixture<ViewHomeworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHomeworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
