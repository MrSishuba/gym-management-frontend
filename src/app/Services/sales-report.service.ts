import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesReportService {

  constructor(private httpClient: HttpClient) { }

  GetNumberOfProductsPurchased(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/numberOfProductsPurchased?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  GetTotalNumberOfOrders(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/totalOrders?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  OrdersByProductAndCategory(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/orderSalesByProductAndCategory?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  GetGeneratorName(userID:number): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/getUsersName?userID=${userID}`, { headers: appheaders });
  }



  

  private getHeaderConfigurations()
    {
      return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
      });
    }
}
