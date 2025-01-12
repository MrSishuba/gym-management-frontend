import { TestBed } from '@angular/core/testing';

import { InspectionTypeAndStatusService } from './inspection-type-and-status.service';

describe('InspectionTypeAndStatusService', () => {
  let service: InspectionTypeAndStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectionTypeAndStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
