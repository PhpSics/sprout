import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupHomeworkComponent } from './setup-homework.component';

describe('SetupHomeworkComponent', () => {
  let component: SetupHomeworkComponent;
  let fixture: ComponentFixture<SetupHomeworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupHomeworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
