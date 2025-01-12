import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateFreeTrialComponent } from './activate-free-trial.component';

describe('ActivateFreeTrialComponent', () => {
  let component: ActivateFreeTrialComponent;
  let fixture: ComponentFixture<ActivateFreeTrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateFreeTrialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivateFreeTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
