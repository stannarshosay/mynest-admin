import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDurationComponent } from './base-duration.component';

describe('BaseDurationComponent', () => {
  let component: BaseDurationComponent;
  let fixture: ComponentFixture<BaseDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseDurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
