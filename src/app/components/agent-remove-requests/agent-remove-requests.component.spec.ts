import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRemoveRequestsComponent } from './agent-remove-requests.component';

describe('AgentRemoveRequestsComponent', () => {
  let component: AgentRemoveRequestsComponent;
  let fixture: ComponentFixture<AgentRemoveRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentRemoveRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentRemoveRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
