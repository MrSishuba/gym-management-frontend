import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkoutCategoryComponent } from './edit-workout-category.component';

describe('EditWorkoutCategoryComponent', () => {
  let component: EditWorkoutCategoryComponent;
  let fixture: ComponentFixture<EditWorkoutCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWorkoutCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditWorkoutCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
