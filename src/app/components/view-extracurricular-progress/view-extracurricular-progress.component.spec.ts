import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExtracurricularProgressComponent } from './view-extracurricular-progress.component';

describe('ViewExtracurricularProgressComponent', () => {
  let component: ViewExtracurricularProgressComponent;
  let fixture: ComponentFixture<ViewExtracurricularProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExtracurricularProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExtracurricularProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
