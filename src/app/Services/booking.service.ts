import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { BookingTimeSlotViewModel } from '../shared/bookingTimeSlotViewModel';
import { BookingViewModel } from '../shared/bookingViewModel';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  apiUrl = 'https://localhost:7185/api/booking/Booking'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  GetBookings(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}`)
    .pipe(map(result => result))
  }

  GetBooking(id: Number, memberUserID: number | null): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/${id}?memberUserID=${memberUserID}`)
      .pipe(map(result => result));
  }
  
  GetMemberBooking(memberUserID: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/memberBookings/${memberUserID}`)
      .pipe(map(result => result));
  }
  
  

  CreateBooking(newBooking: BookingTimeSlotViewModel, userID:number | null): Observable<BookingTimeSlotViewModel>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<BookingTimeSlotViewModel>(`${this.apiUrl}?user_ID=${userID}`, newBooking, httpOptionsWithAuth);
  }

  DeleteBooking(id:Number) : Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.delete<BookingViewModel>(`${this.apiUrl}/${id}`, httpOptionsWithAuth);
  }

  UpdateBooking(id:Number, updatedBooking: BookingTimeSlotViewModel): Observable<BookingTimeSlotViewModel>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.put<BookingTimeSlotViewModel>(`${this.apiUrl}/${id}`, updatedBooking, httpOptionsWithAuth);
}


  GetTotalBookings(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/totalBookings?dateThreshold=${dateThreshold}`, { headers: appheaders});
  }

  GetPopularTimes(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/popularBookingTimes?dateThreshold=${dateThreshold}`, { headers: appheaders});
  }

  GetPopularDates(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/popularBookingDate?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  
  GetPopularLessonPlans(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/mostPopularLessonPlans?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }
  

  
  


  private getHeaderConfigurations()
    {
      return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
      });
    }
 
}
