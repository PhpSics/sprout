import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TuitionfeeComponent } from './tuitionfee.component';

describe('TuitionfeeComponent', () => {
  let component: TuitionfeeComponent;
  let fixture: ComponentFixture<TuitionfeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TuitionfeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TuitionfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
