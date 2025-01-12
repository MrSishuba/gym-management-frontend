import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLessonPlanComponent } from './add-lesson-plan.component';

describe('AddLessonPlanComponent', () => {
  let component: AddLessonPlanComponent;
  let fixture: ComponentFixture<AddLessonPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLessonPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLessonPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
