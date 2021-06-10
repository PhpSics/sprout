import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHomeworkComponent } from './student-homework.component';

describe('StudentHomeworkComponent', () => {
  let component: StudentHomeworkComponent;
  let fixture: ComponentFixture<StudentHomeworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentHomeworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
