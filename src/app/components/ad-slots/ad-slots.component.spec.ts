import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSlotsComponent } from './ad-slots.component';

describe('AdSlotsComponent', () => {
  let component: AdSlotsComponent;
  let fixture: ComponentFixture<AdSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdSlotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
