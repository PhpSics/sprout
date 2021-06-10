import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcurricularGroupManagementComponent } from './ecurricular-group-management.component';

describe('EcurricularGroupManagementComponent', () => {
  let component: EcurricularGroupManagementComponent;
  let fixture: ComponentFixture<EcurricularGroupManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcurricularGroupManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcurricularGroupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
