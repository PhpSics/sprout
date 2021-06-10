import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeOverviewComponent } from './fee-overview.component';

describe('FeeOverviewComponent', () => {
  let component: FeeOverviewComponent;
  let fixture: ComponentFixture<FeeOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
