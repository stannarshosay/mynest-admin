import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedAdsComponent } from './requested-ads.component';

describe('RequestedAdsComponent', () => {
  let component: RequestedAdsComponent;
  let fixture: ComponentFixture<RequestedAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
