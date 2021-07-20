import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAddRequestsComponent } from './agent-add-requests.component';

describe('AgentAddRequestsComponent', () => {
  let component: AgentAddRequestsComponent;
  let fixture: ComponentFixture<AgentAddRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentAddRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAddRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
