import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNewsfeedComponent } from './delete-newsfeed.component';

describe('DeleteNewsfeedComponent', () => {
  let component: DeleteNewsfeedComponent;
  let fixture: ComponentFixture<DeleteNewsfeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteNewsfeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteNewsfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
