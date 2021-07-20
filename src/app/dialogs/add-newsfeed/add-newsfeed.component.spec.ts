import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewsfeedComponent } from './add-newsfeed.component';

describe('AddNewsfeedComponent', () => {
  let component: AddNewsfeedComponent;
  let fixture: ComponentFixture<AddNewsfeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewsfeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewsfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
