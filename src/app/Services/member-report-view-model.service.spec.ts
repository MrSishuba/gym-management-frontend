import { TestBed } from '@angular/core/testing';

import { MemberReportViewModelService } from './member-report-view-model.service';

describe('MemberReportViewModelService', () => {
  let service: MemberReportViewModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberReportViewModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
