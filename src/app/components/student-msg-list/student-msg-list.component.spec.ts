import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMsgListComponent } from './student-msg-list.component';

describe('StudentMsgListComponent', () => {
  let component: StudentMsgListComponent;
  let fixture: ComponentFixture<StudentMsgListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentMsgListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMsgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
