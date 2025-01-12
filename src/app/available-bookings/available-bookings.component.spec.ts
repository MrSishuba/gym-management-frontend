import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableBookingsComponent } from './available-bookings.component';

describe('AvailableBookingsComponent', () => {
  let component: AvailableBookingsComponent;
  let fixture: ComponentFixture<AvailableBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailableBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
