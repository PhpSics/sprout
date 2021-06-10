import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonteachingstaffManagementComponent } from './nonteachingstaff-management.component';

describe('NonteachingstaffManagementComponent', () => {
  let component: NonteachingstaffManagementComponent;
  let fixture: ComponentFixture<NonteachingstaffManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonteachingstaffManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonteachingstaffManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
