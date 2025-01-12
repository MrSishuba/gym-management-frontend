import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTimetableComponent } from './shift-timetable.component';

describe('ShiftTimetableComponent', () => {
  let component: ShiftTimetableComponent;
  let fixture: ComponentFixture<ShiftTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTimetableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
