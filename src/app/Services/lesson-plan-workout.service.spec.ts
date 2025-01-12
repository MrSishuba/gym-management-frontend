import { TestBed } from '@angular/core/testing';

import { LessonPlanWorkoutService } from './lesson-plan-workout.service';

describe('LessonPlanWorkoutService', () => {
  let service: LessonPlanWorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonPlanWorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
