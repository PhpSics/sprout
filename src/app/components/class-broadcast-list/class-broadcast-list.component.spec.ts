import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassBroadcastListComponent } from './class-broadcast-list.component';

describe('ClassBroadcastListComponent', () => {
  let component: ClassBroadcastListComponent;
  let fixture: ComponentFixture<ClassBroadcastListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassBroadcastListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassBroadcastListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
