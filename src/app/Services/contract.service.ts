import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  apiUrl = 'https://localhost:7185/api/email';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    responseType: 'text' as 'json' // Add this line
  };


  constructor(private httpClient: HttpClient) {}

  send3MonthContract(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Send3MonthContract`, { email }, this.httpOptions);
  }

  send6MonthContract(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Send6MonthContract`, { email }, this.httpOptions);
  }

  send12MonthContract(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Send12MonthContract`, { email }, this.httpOptions);
  }

}
