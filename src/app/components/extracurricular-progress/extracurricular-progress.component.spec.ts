import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtracurricularProgressComponent } from './extracurricular-progress.component';

describe('ExtracurricularProgressComponent', () => {
  let component: ExtracurricularProgressComponent;
  let fixture: ComponentFixture<ExtracurricularProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtracurricularProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtracurricularProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
