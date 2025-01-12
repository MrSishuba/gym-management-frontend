import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditTrail } from '../shared/audit-trail';

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private apiUrl = 'https://localhost:7185/api/';

  constructor(private http: HttpClient) { }

  getAuditTrails(): Observable<AuditTrail[]> {
    return this.http.get<AuditTrail[]>(`${this.apiUrl}AuditTrail/getAuditTrails`);
  }


  GetAuditTrailReportData(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.http.get(`https://localhost:7185/api/Reports/auditTrail?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  private getHeaderConfigurations()
  {
    return new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
    });
  }
}
