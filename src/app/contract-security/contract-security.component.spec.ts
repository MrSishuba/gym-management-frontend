import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractSecurityComponent } from './contract-security.component';

describe('ContractSecurityComponent', () => {
  let component: ContractSecurityComponent;
  let fixture: ComponentFixture<ContractSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractSecurityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
