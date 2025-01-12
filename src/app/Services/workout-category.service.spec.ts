import { TestBed } from '@angular/core/testing';

import { WorkoutCategoryService } from './workout-category.service';

describe('WorkoutCategoryService', () => {
  let service: WorkoutCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
