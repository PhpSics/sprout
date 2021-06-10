import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcademicProgressComponent } from './view-academic-progress.component';

describe('ViewAcademicProgressComponent', () => {
  let component: ViewAcademicProgressComponent;
  let fixture: ComponentFixture<ViewAcademicProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAcademicProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAcademicProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
