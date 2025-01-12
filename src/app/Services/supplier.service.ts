import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Supplier } from '../shared/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  apiUrl = 'https://localhost:7185/api/supplier/Supplier'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  GetSuppliers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetSuppliers`)
      .pipe(map(result => result));
  }

  GetSupplier(id: Number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetSupplier/${id}`)
      .pipe(map(result => result));
  }

  AddSupplier(newSupplier: Supplier): Observable<Supplier> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<Supplier>(`${this.apiUrl}/PostSupplier`, newSupplier, httpOptionsWithAuth);
  }

  DeleteSupplier(id: Number): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.delete<Supplier>(`${this.apiUrl}/DeleteSupplier/${id}`, httpOptionsWithAuth);
  }

  UpdateSupplier(id: Number, updatedSupplier: Supplier): Observable<Supplier> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.put<Supplier>(`${this.apiUrl}/PutSupplier/${id}`, updatedSupplier, httpOptionsWithAuth);
  }


}
