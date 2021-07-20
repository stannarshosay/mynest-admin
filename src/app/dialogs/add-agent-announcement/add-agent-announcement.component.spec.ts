import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgentAnnouncementComponent } from './add-agent-announcement.component';

describe('AddAgentAnnouncementComponent', () => {
  let component: AddAgentAnnouncementComponent;
  let fixture: ComponentFixture<AddAgentAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAgentAnnouncementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgentAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
