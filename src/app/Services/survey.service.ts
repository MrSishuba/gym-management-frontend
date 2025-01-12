import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = 'https://localhost:7185/api/survey';

  constructor(private http: HttpClient) {}

  submitSurvey(surveyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, surveyData); // Updated URL
  }

  getSurveyResponses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/responses`);
  }

  exportSurveyResponses(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }
}
