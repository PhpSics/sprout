import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupFeeStructureComponent } from './setup-fee-structure.component';

describe('SetupFeeStructureComponent', () => {
  let component: SetupFeeStructureComponent;
  let fixture: ComponentFixture<SetupFeeStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupFeeStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupFeeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
