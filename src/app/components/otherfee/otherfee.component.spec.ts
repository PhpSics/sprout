import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherfeeComponent } from './otherfee.component';

describe('OtherfeeComponent', () => {
  let component: OtherfeeComponent;
  let fixture: ComponentFixture<OtherfeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherfeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
