import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTeachersComponent } from './non-teachers.component';

describe('NonTeachersComponent', () => {
  let component: NonTeachersComponent;
  let fixture: ComponentFixture<NonTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonTeachersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
