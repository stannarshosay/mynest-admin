import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCommonComponent } from './delete-common.component';

describe('DeleteCommonComponent', () => {
  let component: DeleteCommonComponent;
  let fixture: ComponentFixture<DeleteCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
