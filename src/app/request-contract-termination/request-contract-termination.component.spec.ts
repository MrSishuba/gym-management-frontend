import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestContractTerminationComponent } from './request-contract-termination.component';

describe('RequestContractTerminationComponent', () => {
  let component: RequestContractTerminationComponent;
  let fixture: ComponentFixture<RequestContractTerminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestContractTerminationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestContractTerminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
