import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTuitionfeeComponent } from './add-tuitionfee.component';

describe('AddTuitionfeeComponent', () => {
  let component: AddTuitionfeeComponent;
  let fixture: ComponentFixture<AddTuitionfeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTuitionfeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTuitionfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
