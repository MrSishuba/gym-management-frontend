import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractSettingsService {
  private apiUrl = 'https://localhost:7185/api/ContractSettings';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, text/json'  // Accept multiple content types
    })
  };

  constructor(private httpClient: HttpClient) {}

  // Get contract settings from the ContractSettingsController
  getContractSettings(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/GetContractSettings`, this.httpOptions);
  }

  // Update contract deletion time using the ContractSettingsController
  updateContractDeletionTime(settings: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/UpdateContractDeletionTime`, settings, this.httpOptions);
  }
}
