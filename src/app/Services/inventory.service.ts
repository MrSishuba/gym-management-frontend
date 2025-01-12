import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import {InventoryViewModel } from '../shared/inventoryViewModel';
import { WriteOffViewModel } from '../shared/writeOffViewModel';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  apiUrl = 'https://localhost:7185/api/Inventories'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  GetItems(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}`)
    .pipe(map(result => result))
  }

  GetItem(id: Number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/${id}`)
      .pipe(map(result => result));
  }

  AddItem(newItem: InventoryViewModel): Observable<InventoryViewModel>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<InventoryViewModel>(`${this.apiUrl}`, newItem, httpOptionsWithAuth);
  }

  EditItem(id:Number, updatedItem: InventoryViewModel):Observable<InventoryViewModel>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.put<InventoryViewModel>(`${this.apiUrl}/${id}`, updatedItem, httpOptionsWithAuth);
  }

  DeleteItem(id:Number) : Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.delete<InventoryViewModel>(`${this.apiUrl}/${id}`, httpOptionsWithAuth);
  }

  CreateWriteOff(writeOff:WriteOffViewModel):Observable<WriteOffViewModel>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<WriteOffViewModel>(`https://localhost:7185/api/WriteOff`, writeOff, httpOptionsWithAuth);
  }

  GetReportData(): Observable<any> {
    let appheaders = this.getHeaderConfigurations();
    return this.httpClient.get<any[]>(`https://localhost:7185/api/Reports/stockData`, { headers: appheaders });
  }


  
  private getHeaderConfigurations()
  {
    return new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
    });
  }
}
