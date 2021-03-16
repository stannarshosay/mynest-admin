import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveRequirementsComponent } from './active-requirements.component';

describe('ActiveRequirementsComponent', () => {
  let component: ActiveRequirementsComponent;
  let fixture: ComponentFixture<ActiveRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveRequirementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
