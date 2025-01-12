import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAttendanceListComponent } from './generate-attendance-list.component';

describe('GenerateAttendanceListComponent', () => {
  let component: GenerateAttendanceListComponent;
  let fixture: ComponentFixture<GenerateAttendanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateAttendanceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
