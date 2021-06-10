import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeManagementComponent } from './fee-management.component';

describe('FeeManagementComponent', () => {
  let component: FeeManagementComponent;
  let fixture: ComponentFixture<FeeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
