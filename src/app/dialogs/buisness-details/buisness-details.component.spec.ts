import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuisnessDetailsComponent } from './buisness-details.component';

describe('BuisnessDetailsComponent', () => {
  let component: BuisnessDetailsComponent;
  let fixture: ComponentFixture<BuisnessDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuisnessDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuisnessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
