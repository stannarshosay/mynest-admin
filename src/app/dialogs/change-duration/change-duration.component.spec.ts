import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDurationComponent } from './change-duration.component';

describe('ChangeDurationComponent', () => {
  let component: ChangeDurationComponent;
  let fixture: ComponentFixture<ChangeDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
