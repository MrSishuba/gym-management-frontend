import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Inspection } from '../shared/inspection';
import { InspectionViewModel } from '../shared/inspectionViewModel';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  apiUrl = 'https://localhost:7185/api/inspection/Inspection'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  GetInspections(): Observable<InspectionViewModel[]> {
    return this.httpClient.get<{ result: any, value: InspectionViewModel[] }>(`${this.apiUrl}`).pipe(
      map(response => response.value) // Extract the 'value' array from the response
    );
  }

  GetInspection(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/${id}`)
    .pipe(map(result => result))
  }

  ViewInspection(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/${id}`)
    .pipe(map(result => result))
  }

  AddInspection(newInspection: Inspection): Observable<Inspection>{
    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<Inspection>(`${this.apiUrl}`, newInspection, httpOptionsWithAuth);
  }


  InventoryInspections(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/inventoryInspections?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  EqupimentInspections(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/equipmentInspections?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  WriteOffsPerItem(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/writeOffsPerItem?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  
  NumberOfWriteoffs(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/numberOfWriteOffs?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }

  QuantityWrittenOff(dateThreshold: string): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/totalQuantityWrittenOff?dateThreshold=${dateThreshold}`, { headers: appheaders });
  }







  private getHeaderConfigurations()
  {
    return new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
    });
  }

 
 
}
