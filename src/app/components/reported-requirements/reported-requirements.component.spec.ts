import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedRequirementsComponent } from './reported-requirements.component';

describe('ReportedRequirementsComponent', () => {
  let component: ReportedRequirementsComponent;
  let fixture: ComponentFixture<ReportedRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportedRequirementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
