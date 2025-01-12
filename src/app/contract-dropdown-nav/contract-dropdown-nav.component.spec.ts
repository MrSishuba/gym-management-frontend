import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDropdownNavComponent } from './contract-dropdown-nav.component';

describe('ContractDropdownNavComponent', () => {
  let component: ContractDropdownNavComponent;
  let fixture: ComponentFixture<ContractDropdownNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractDropdownNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractDropdownNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
