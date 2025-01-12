import { Component, OnInit } from '@angular/core';
import { EmployeeShiftService } from '../Services/employee-shift.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-employee-shift',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-shift.component.html',
  styleUrls: ['./employee-shift.component.css']
})
export class EmployeeShiftComponent implements OnInit {
  weekdays: any[] = [];
  weekends: any[] = [];
  daysOfWeek: any[] = [];

  constructor(private employeeShiftService: EmployeeShiftService, private router: Router) { }

  ngOnInit(): void {
    this.getShifts();
  }

  getShifts(): void {
    this.employeeShiftService.getShiftsByDay().subscribe({
      next: (response) => {
        this.weekdays = response.weekdays;
        this.weekends = response.weekends;

        this.daysOfWeek = [
          { name: 'Monday', shifts: this.getShiftsForDay(1) },
          { name: 'Tuesday', shifts: this.getShiftsForDay(2) },
          { name: 'Wednesday', shifts: this.getShiftsForDay(3) },
          { name: 'Thursday', shifts: this.getShiftsForDay(4) },
          { name: 'Friday', shifts: this.getShiftsForDay(5) },
          { name: 'Saturday', shifts: this.getShiftsForDay(6) },
          { name: 'Sunday', shifts: this.getShiftsForDay(0) },
        ];

        console.log('Weekdays:', this.weekdays);
        console.log('Weekends:', this.weekends);
        console.log('Days of Week:', this.daysOfWeek);
      },
      error: (err) => {
        console.error('Error fetching shifts:', err);
      }
    });
    
  }

  getShiftsForDay(dayOfWeek: number): any[] {
    let shifts: any[] = [];

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Weekday shifts
      shifts = this.weekdays;
    } else {
      // Weekend shifts
      shifts = this.weekends;
    }

    return shifts; // Assume shifts apply to all days; adjust if you have specific rules
  }
  

  // startShift(shiftId: number): void {
  //   const startShiftModel = {
  //     EmployeeId: this.getEmployeeId(),
  //     ShiftId: shiftId
  //   };

  //   this.employeeShiftService.startShift(startShiftModel).subscribe((response: any) => {
  //     if (response.Status === 'Success') {
  //       this.employeeShiftId = response.EmployeeShiftId;
  //     }
  //   });
  // }

  // endShift(): void {
  //   if (!this.employeeShiftId) {
  //     return;
  //   }

  //   this.employeeShiftService.endShift(this.employeeShiftId).subscribe((response: any) => {
  //     if (response.Status === 'Success') {
  //       this.employeeShiftId = null;
  //     }
  //   });
  // }

  // getShiftDetails() {
  //   this.employeeShiftService.getEmployeeShiftDetails(this.employeeId).subscribe(data => {
  //     this.shifts = data;
  //   });
  // }

  // calculateHoursWorked() {
  //   this.employeeShiftService.calculateHoursWorked(this.employeeId, this.period).subscribe(data => {
  //     this.hoursWorked = { ...data, employeeId: this.employeeId };
  //   });
  // }

  exportShifts(format: string) {
    this.employeeShiftService.exportShifts(format).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shifts.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  importShiftsFromJson(event: any) {
    const file = event.target.files[0];
    this.employeeShiftService.importShiftsFromJson(file).subscribe(response => {
      console.log(response);
    });
  }

  importShiftsFromExcel(event: any) {
    const file = event.target.files[0];
    this.employeeShiftService.importShiftsFromExcel(file).subscribe(response => {
      console.log(response);
    });
  }

  getEmployeeId(): number {
    // Assuming employee ID is stored in localStorage or fetched via a service
    return parseInt(localStorage.getItem('employeeId') || '0', 10);
  }

  navigateBack() {
    this.router.navigate(['/employee-manager']);
  }
}
