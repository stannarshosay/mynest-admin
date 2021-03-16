import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedVendorsComponent } from './reported-vendors.component';

describe('ReportedVendorsComponent', () => {
  let component: ReportedVendorsComponent;
  let fixture: ComponentFixture<ReportedVendorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportedVendorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
