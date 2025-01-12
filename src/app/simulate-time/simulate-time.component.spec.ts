import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateTimeComponent } from './simulate-time.component';

describe('SimulateTimeComponent', () => {
  let component: SimulateTimeComponent;
  let fixture: ComponentFixture<SimulateTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulateTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimulateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
