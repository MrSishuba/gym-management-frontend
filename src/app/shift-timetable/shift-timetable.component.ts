import { Component, OnInit } from '@angular/core';
import { EmployeeShiftService } from '../Services/employee-shift.service';
import { EmployeeShift } from '../shared/EmployeeShift';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shift-timetable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './shift-timetable.component.html',
  styleUrls: ['./shift-timetable.component.css']
})
export class ShiftTimetableComponent implements OnInit {
  shifts: EmployeeShift[] = [];
  employeeId: number = 1; // Change this to dynamically get the logged-in employee's ID

  constructor(private employeeShiftService: EmployeeShiftService, private router: Router) {}

  ngOnInit(): void {
    this.getShiftDetails();
  }

  getShiftDetails() {
    this.employeeShiftService.getEmployeeShiftDetails(this.employeeId).subscribe(data => {
      this.shifts = data;
    });
  }

  selectShift(shiftId: number) {
    this.router.navigate(['/employee-shift', shiftId]);
  }
}
