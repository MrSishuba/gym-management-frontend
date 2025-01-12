import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHelpPageComponent } from './employee-help-page.component';

describe('EmployeeHelpPageComponent', () => {
  let component: EmployeeHelpPageComponent;
  let fixture: ComponentFixture<EmployeeHelpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeHelpPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
