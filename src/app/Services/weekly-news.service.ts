import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeeklyNewsService {
  // The base API URL that matches the controller route
  private apiUrl = 'https://localhost:7185/api/WeeklyNews';

  constructor(private https: HttpClient) {}

  // Explicitly call the backend method at the '/image' endpoint
  getWeeklyNewsImage(): Observable<any> {
    return this.https.get(`${this.apiUrl}/image`);
  }
}
