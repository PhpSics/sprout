import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkHomeworkComponent } from './mark-homework.component';

describe('MarkHomeworkComponent', () => {
  let component: MarkHomeworkComponent;
  let fixture: ComponentFixture<MarkHomeworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkHomeworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
