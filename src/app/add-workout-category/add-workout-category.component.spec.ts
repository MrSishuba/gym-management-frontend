import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkoutCategoryComponent } from './add-workout-category.component';

describe('AddWorkoutCategoryComponent', () => {
  let component: AddWorkoutCategoryComponent;
  let fixture: ComponentFixture<AddWorkoutCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkoutCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWorkoutCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
