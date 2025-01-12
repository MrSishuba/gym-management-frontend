import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FinancialReportService {

  constructor(private httpClient: HttpClient) { }

  
  OrderSalesByProductAndCategory(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/orderSalesByProductAndCategory?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }


  TotalReceived(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/totalReceived?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  
  TotalOutstanding(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/totalOutstanding?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  PaymentsByType(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/paymentsByType?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }






  private getHeaderConfigurations()
  {
    return new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
    });
  }

}
