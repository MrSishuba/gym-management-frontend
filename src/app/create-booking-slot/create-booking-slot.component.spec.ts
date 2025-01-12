import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookingSlotComponent } from './create-booking-slot.component';

describe('CreateBookingSlotComponent', () => {
  let component: CreateBookingSlotComponent;
  let fixture: ComponentFixture<CreateBookingSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBookingSlotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateBookingSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
