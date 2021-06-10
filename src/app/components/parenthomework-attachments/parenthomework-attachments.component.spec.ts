import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParenthomeworkAttachmentsComponent } from './parenthomework-attachments.component';

describe('ParenthomeworkAttachmentsComponent', () => {
  let component: ParenthomeworkAttachmentsComponent;
  let fixture: ComponentFixture<ParenthomeworkAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParenthomeworkAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParenthomeworkAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
