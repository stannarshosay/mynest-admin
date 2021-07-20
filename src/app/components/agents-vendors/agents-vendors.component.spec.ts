import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsVendorsComponent } from './agents-vendors.component';

describe('AgentsVendorsComponent', () => {
  let component: AgentsVendorsComponent;
  let fixture: ComponentFixture<AgentsVendorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentsVendorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
