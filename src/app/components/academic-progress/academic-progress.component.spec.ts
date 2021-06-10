import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicProgressComponent } from './academic-progress.component';

describe('AcademicProgressComponent', () => {
  let component: AcademicProgressComponent;
  let fixture: ComponentFixture<AcademicProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
