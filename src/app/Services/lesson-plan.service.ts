import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { LessonPlan } from '../shared/lessonPlan';
import { LessonPlanWorkout } from '../shared/lessonPlanWorkout';

@Injectable({
  providedIn: 'root'
})
export class LessonPlanService {

  apiUrl = 'https://localhost:7185/api/lessonPlan/LessonPlan'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  GetPlans(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/all`)
    .pipe(map(result => result))
  }

  GetPlan(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/${id}`)
    .pipe(map(result => result))
  }

  GetPlanWithWorkouts(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/with-workouts/${id}`, this.httpOptions)
    .pipe(map(result => result))
  }

  AddPlan(newPlan: LessonPlan): Observable<LessonPlan>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<LessonPlan>(`${this.apiUrl}/lessonplan`, newPlan, httpOptionsWithAuth);
  }
  
  AddPlanWorkout(newPlanWorkout: LessonPlanWorkout[]): Observable<LessonPlanWorkout[]> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<LessonPlanWorkout[]>(`${this.apiUrl}/lessonplanworkout`, newPlanWorkout, httpOptionsWithAuth);
  }

  DeletePlan(id:Number) : Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.delete<LessonPlan>(`${this.apiUrl}/${id}`, httpOptionsWithAuth);
  }

  UpdatePlan(updatePlan: LessonPlan, id:Number): Observable<LessonPlan>{
   // console.log(updateCategory);
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
   
      return this.httpClient.put<LessonPlan>(`${this.apiUrl}/lessonplan/${id}`, updatePlan, httpOptionsWithAuth);
  }
}
