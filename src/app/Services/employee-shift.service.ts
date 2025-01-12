import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeShift } from '../shared/EmployeeShift';
import { HoursWorked } from '../shared/EmployeeShift';
import { Shift } from '../shared/EmployeeShift';

@Injectable({
  providedIn: 'root'
})
  export class EmployeeShiftService {
    private apiUrl = 'https://localhost:7185/api/EmployeeShift/'; // Adjust the URL as needed

    
    
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
  constructor(private http: HttpClient) { }

  
  startShift(model: { EmployeeId: number; ShiftId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl }StartShift`, model);
  }

  endShift(employeeShiftId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}EndShift`, employeeShiftId);
  }

  getEmployeeShiftDetails(employeeId: number): Observable<EmployeeShift[]> {
    return this.http.get<EmployeeShift[]>(`${this.apiUrl}GetEmployeeShiftDetails?employeeId=${employeeId}`);
  }

  calculateHoursWorked(employeeId: number, period: string): Observable<HoursWorked> {
    return this.http.get<HoursWorked>(`${this.apiUrl}CalculateHoursWorked?employeeId=${employeeId}&period=${period}`);
  }

  exportShifts(format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}ExportShifts?format=${format}`, { responseType: 'blob' });
  }

  importShiftsFromJson(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}ImportShiftsFromJson`, formData);
  }

  importShiftsFromExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}ImportShiftsFromExcel`, formData);
  }



  // Fetch shifts categorized by days of the week (weekdays and weekends)
  getShiftsByDay(): Observable<{ weekdays: any[], weekends: any[] }> {
    return this.http.get<{ weekdays: any[], weekends: any[] }>(`${this.apiUrl}GetShiftsByDay`, this.httpOptions);
  }
}
