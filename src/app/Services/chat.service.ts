import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://localhost:7185/api/ChatBot'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    // Manually wrap the message in quotes to ensure it's sent as a JSON string
    const payload = `"${message}"`;
    return this.http.post(`${this.apiUrl}/ask`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
