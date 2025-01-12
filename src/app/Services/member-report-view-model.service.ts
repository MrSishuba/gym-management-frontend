import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MemberReportViewModelService {

  constructor(private httpClient: HttpClient) { }

  TotalNewContracts(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/totalNewContracts?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  MemberBookings(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/memberBookings?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  MemberAgeDemographic(): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/memberAgeDemographic`, { headers: appheaders });
  }

  ContractsSignedByType(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/contractsSignedByType?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  
  UnredeemedRewards(): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/unredeemedRewards`, { headers: appheaders });
  }


  private getHeaderConfigurations()
  {
    return new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
    });
  }
}
