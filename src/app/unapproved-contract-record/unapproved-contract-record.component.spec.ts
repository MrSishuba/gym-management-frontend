import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnapprovedContractRecordComponent } from './unapproved-contract-record.component';

describe('UnapprovedContractRecordComponent', () => {
  let component: UnapprovedContractRecordComponent;
  let fixture: ComponentFixture<UnapprovedContractRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnapprovedContractRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnapprovedContractRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
