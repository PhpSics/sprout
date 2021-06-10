import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMailboxComponent } from './edit-mailbox.component';

describe('EditMailboxComponent', () => {
  let component: EditMailboxComponent;
  let fixture: ComponentFixture<EditMailboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMailboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMailboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
