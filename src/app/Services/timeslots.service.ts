import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { TmeSlotCalanderViewModel } from '../shared/bookingCalanderView';
import { TimeSlot } from '../shared/timeSlot';
import { BookingTimeSlotViewModel } from '../shared/bookingTimeSlotViewModel';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TimeslotsService {

  apiUrl = 'https://localhost:7185/api/bookingtimeslot/TimeSlot'
  URL = 'https://localhost:7185/api/attendanceList/AttendanceList'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }


  GetSlots(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}`)
    .pipe(map(result => result))
  }
  
  GetCalendarTimeSlots(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/${id}`)
    .pipe(map(result => result))
  }

  GetByLessonPlan(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/lesson-plan/${id}`)
    .pipe(map(result => result))
  }

  GeByDate(date:string): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/by-date/${date}`)
    .pipe(map(result => result))
  }

  GetEmployees(): Observable<any>{
    return this.httpClient.get('https://localhost:7185/api/User/employee')
    .pipe(map(result => result))
  }

  GetAttendance(timeSlotID:Number): Observable<any>{
    return this.httpClient.get(`${this.URL}/${timeSlotID}`)
    .pipe(map(result => result))
  }


  
  CreateBookingSlot(newTimeSlot: TimeSlot): Observable<TimeSlot>{
    const body = { newTimeSlot };

    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<TimeSlot>(`${this.apiUrl}`, newTimeSlot, httpOptionsWithAuth);
  }

  DeleteSlot(id:Number) : Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.delete<TimeSlot>(`${this.apiUrl}/${id}`, httpOptionsWithAuth);
  }

  UpdateSlot(id:Number, updatedSlot: TimeSlot): Observable<TimeSlot>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.put<TimeSlot>(`${this.apiUrl}/${id}`, updatedSlot, httpOptionsWithAuth);
}
}
