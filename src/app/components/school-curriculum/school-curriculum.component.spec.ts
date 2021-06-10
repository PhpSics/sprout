import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolCurriculumComponent } from './school-curriculum.component';

describe('SchoolCurriculumComponent', () => {
  let component: SchoolCurriculumComponent;
  let fixture: ComponentFixture<SchoolCurriculumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolCurriculumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
