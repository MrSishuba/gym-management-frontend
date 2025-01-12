import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { SupplierOrder } from '../shared/supplier-order';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService {
  private apiUrl = 'https://localhost:7185/api/supplier/Supplier';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) {}

  getAllSupplierOrders(): Observable<SupplierOrder[]> {
    return this.httpClient.get<SupplierOrder[]>(`${this.apiUrl}/GetAllSupplierOrders`, this.httpOptions);
  }

  getProductCategories(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetProductCategories`);
  }

  getProductsByCategory(categoryId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetProductsByCategory/${categoryId}`).pipe(
      tap(products => console.log('Service response:', products)), // Debug statement
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error(error)); 
      })
    );
  }

  placeSupplierOrder(order: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post(`${this.apiUrl}/PlaceSupplierOrder`, order, httpOptionsWithAuth);
  }

  receiveSupplierOrder(receiveOrderVm: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<any>(`${this.apiUrl}/receivesupplierorder`, receiveOrderVm, httpOptionsWithAuth);
  }

  updateSupplierOrderStatus(statusUpdateVm: { supplier_Order_ID: number, status: number }): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post(`${this.apiUrl}/UpdateSupplierOrderStatus`, statusUpdateVm, httpOptionsWithAuth);
  }
}
