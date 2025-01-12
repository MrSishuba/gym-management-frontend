import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Discount, PaymentViewModel, VAT } from '../shared/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private finalAmountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private apiUrl = 'https://localhost:7185/api/';

  constructor(private http: HttpClient) { }

  //Discount
  getDiscount(): Observable<Discount> {
    return this.http.get<Discount>(`${this.apiUrl}Discount/GetDiscount`);
  }

  updateDiscount(id: number, discount: Discount): Observable<Discount> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.put<Discount>(`${this.apiUrl}Discount/UpdateDiscount/${id}`, discount, httpOptionsWithAuth);
  }

  validateDiscountCode(discountCode: string): Observable<{ discount_Percentage: number }> {
    return this.http.get<{ discount_Percentage: number }>(`${this.apiUrl}Discount/ValidateDiscount/${discountCode}`);
  }

  //VAT
  getVAT(): Observable<VAT> {
    return this.http.get<VAT>(`${this.apiUrl}VAT/GetVAT`);
  }

  updateVAT(id: number, vat: VAT): Observable<VAT> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.put<VAT>(`${this.apiUrl}VAT/UpdateVAT/${id}`, vat, httpOptionsWithAuth);
  }

  //payment
  createPayment(payment: PaymentViewModel): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<any>(`${this.apiUrl}Payment/CreatePayment`, payment, httpOptionsWithAuth);
  }

  getContractByMemberId(memberId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Payment/GetContractByMemberId/${memberId}`, this.httpOptions);
  }

  getPayments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Payment/GetPayments`);
  }

  //shared method for checkout and payfast
  setFinalAmount(amount: number): void {
    console.log('Setting finalAmount to:', amount); // Debugging line
    this.finalAmountSubject.next(amount);
  }

  getFinalAmount(): Observable<number> {
    return this.finalAmountSubject.asObservable();
  }
}
