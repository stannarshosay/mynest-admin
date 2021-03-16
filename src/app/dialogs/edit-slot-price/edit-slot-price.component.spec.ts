import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSlotPriceComponent } from './edit-slot-price.component';

describe('EditSlotPriceComponent', () => {
  let component: EditSlotPriceComponent;
  let fixture: ComponentFixture<EditSlotPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSlotPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSlotPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
