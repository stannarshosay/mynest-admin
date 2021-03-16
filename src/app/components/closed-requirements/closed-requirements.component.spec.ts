import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedRequirementsComponent } from './closed-requirements.component';

describe('ClosedRequirementsComponent', () => {
  let component: ClosedRequirementsComponent;
  let fixture: ComponentFixture<ClosedRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedRequirementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
