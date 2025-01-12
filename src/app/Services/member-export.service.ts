import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberExportService {
  private apiUrl = 'https://localhost:7185/api/MemberExport';  // Correct URL for MemberExport

  constructor(private httpClient: HttpClient) {}

  exportMembersToJson(): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/ExportMembers`, { responseType: 'blob' });
  }
}
