import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubscriptionStatus {
    member_ID: number;
    name: string;
    surname: string;
    membership_Status_Description: string;
    monthly_Fee_Due: number;
    outstanding_Payment: number;
    has_Paid: boolean;
    total_Sum_Paid: number;
    next_Expected_Payment_Date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'https://localhost:7185/api/subscription';

  constructor(private http: HttpClient) { }

  getSubscriptions(): Observable<SubscriptionStatus[]> {
    return this.http.get<SubscriptionStatus[]>(`${this.apiUrl}/CheckSubscriptions`);
  }

  blockMember(memberId: number): Observable<string> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 
  
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/plain, text/json'
      }),
      responseType: 'text' as 'json' // Specify the response type here
    };
  
    return this.http.post<string>(`${this.apiUrl}/BlockMember/${memberId}`, {}, httpOptionsWithAuth);
  }
  

  reactivateMember(memberId: number): Observable<string> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 
  
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/plain, text/json'
      }),
      responseType: 'text' as 'json' // Specify the response type here
    };

    return this.http.post<string>(`${this.apiUrl}/ReactivateMember/${memberId}`, {},httpOptionsWithAuth);
  }

  simulateTime(monthsToAdvance: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/SimulateTime?monthsToAdvance=${monthsToAdvance}`, null, { responseType: 'text',
        headers: {
            'Accept': 'application/json, text/plain, text/json'
        }
     });
  }
  
}
