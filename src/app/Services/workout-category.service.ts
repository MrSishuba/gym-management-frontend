import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { WorkoutCategory } from '../shared/workoutCategory';

@Injectable({
  providedIn: 'root'
})
export class WorkoutCategoryService {

  apiUrl = 'https://localhost:7185/api/workoutCategory/WorkoutCategory'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  GetCategories(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}`)
    .pipe(map(result => result))
  }

  GetCategory(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/${id}`)
    .pipe(map(result => result))
  }

  AddCategory(newCategory: WorkoutCategory): Observable<WorkoutCategory>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<WorkoutCategory>(`${this.apiUrl}`, newCategory, httpOptionsWithAuth);
  }
 
  DeleteCategory(id:Number) : Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.delete<WorkoutCategory>(`${this.apiUrl}/${id}`, httpOptionsWithAuth);
  }

  UpdateCategory(updateCategory: WorkoutCategory, id:Number): Observable<WorkoutCategory>{
   // console.log(updateCategory);
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
   
      return this.httpClient.put<WorkoutCategory>(`${this.apiUrl}/${id}`, updateCategory, httpOptionsWithAuth);
  }
  
}
