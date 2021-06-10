import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMailboxComponent } from './create-mailbox.component';

describe('CreateMailboxComponent', () => {
  let component: CreateMailboxComponent;
  let fixture: ComponentFixture<CreateMailboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMailboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMailboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
