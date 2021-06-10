import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkAttachmentsComponent } from './homework-attachments.component';

describe('HomeworkAttachmentsComponent', () => {
  let component: HomeworkAttachmentsComponent;
  let fixture: ComponentFixture<HomeworkAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeworkAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
