export interface EmployeeShift {
    employeeShiftId: number;
    employeeId: number;
    shiftId: number;
    shiftStartTime: Date;
    shiftEndTime?: Date;
  }
  
  // export interface Shift {
  //   shiftId: number;
  //   shiftNumber: number;
  //   startTime: string;
  //   endTime: string;
  // }

  export interface Shift {
    Shift_ID: number;
    Start_Time: string;
    End_Time: string;
  }
  
  export interface Day {
    name: string;
    shifts: Shift[];
  }
  
  export interface HoursWorked {
    employeeId: number;
    totalHoursWorked: number;
  }
  