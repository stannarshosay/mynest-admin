import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAnnouncementsComponent } from './agent-announcements.component';

describe('AgentAnnouncementsComponent', () => {
  let component: AgentAnnouncementsComponent;
  let fixture: ComponentFixture<AgentAnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentAnnouncementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
