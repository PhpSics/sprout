import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherRolesComponent } from './teacher-roles.component';

describe('TeacherRolesComponent', () => {
  let component: TeacherRolesComponent;
  let fixture: ComponentFixture<TeacherRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
