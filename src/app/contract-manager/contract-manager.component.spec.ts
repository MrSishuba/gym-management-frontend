import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractManagerComponent } from './contract-manager.component';

describe('ContractManagerComponent', () => {
  let component: ContractManagerComponent;
  let fixture: ComponentFixture<ContractManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
