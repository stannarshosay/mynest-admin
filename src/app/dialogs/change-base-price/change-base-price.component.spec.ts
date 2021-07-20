import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBasePriceComponent } from './change-base-price.component';

describe('ChangeBasePriceComponent', () => {
  let component: ChangeBasePriceComponent;
  let fixture: ComponentFixture<ChangeBasePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeBasePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBasePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
