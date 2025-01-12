import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseUrl = 'https://localhost:7185/api/Reports'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private http: HttpClient) { }



  getSalesData(filter: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/salesDashboard?filter=${filter}`) .pipe(map(result => result));;
  }

  getSubscriptionData(filter: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subscriptions?filter=${filter}`) .pipe(map(result => result));;
  }

  getPopularProducts(filter: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/popular-products?filter=${filter}`) .pipe(map(result => result));;
  }

  getTopMembers(filter: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/top-members?filter=${filter}`) .pipe(map(result => result));;
  }


  private getHeaderConfigurations()
  {
    return new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
    });
  }
}
