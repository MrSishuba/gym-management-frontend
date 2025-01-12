import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Equipment } from '../shared/equipment';

@Injectable({
  providedIn: 'root'
})

export class EquipmentService {
  apiUrl = 'https://localhost:7185/api/equipment/Equipment'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }



  GetEquipments(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}`)
    .pipe(map(result => result))
  }



  GetEquipment(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/${id}`)
    .pipe(map(result => result))
  }


  AddEquipment(newEquipment: Equipment): Observable<Equipment>{
    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<Equipment>(`${this.apiUrl}`, newEquipment, httpOptionsWithAuth);
  }
 
  DeleteEquipment(id:Number) : Observable<any> {
    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.delete<Equipment>(`${this.apiUrl}/${id}`, httpOptionsWithAuth);
  }

  UpdateEquipment(id:Number, updatedEquipment: Equipment): Observable<Equipment>{
    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
      return this.httpClient.put<Equipment>(`${this.apiUrl}/${id}`, updatedEquipment, httpOptionsWithAuth);
  }
}
