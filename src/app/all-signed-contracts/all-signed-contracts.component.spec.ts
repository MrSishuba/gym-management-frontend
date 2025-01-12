import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSignedContractsComponent } from './all-signed-contracts.component';

describe('AllSignedContractsComponent', () => {
  let component: AllSignedContractsComponent;
  let fixture: ComponentFixture<AllSignedContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSignedContractsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllSignedContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
