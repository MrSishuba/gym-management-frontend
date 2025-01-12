import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnapprovedUploadedContractComponent } from './unapproved-uploaded-contract.component';

describe('UnapprovedUploadedContractComponent', () => {
  let component: UnapprovedUploadedContractComponent;
  let fixture: ComponentFixture<UnapprovedUploadedContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnapprovedUploadedContractComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnapprovedUploadedContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
