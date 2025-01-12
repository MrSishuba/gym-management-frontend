import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Workout } from '../shared/workout';
import { WorkoutViewModel } from '../shared/workoutViewModel';
@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  apiUrl = 'https://localhost:7185/api/workouts/Workouts'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }


  GetWorkouts(): Observable<WorkoutViewModel[]> {
    return this.httpClient.get<{ result: any, value: WorkoutViewModel[] }>(`${this.apiUrl}`).pipe(
      map(response => response.value) 
    );
  }


  GetWorkout(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/all/${id}`)
    .pipe(map(result => result))
  }


  ViewWorkout(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/${id}`)
    .pipe(map(result => result))
  }

  AddWorkout(newWorkout: Workout): Observable<Workout>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post<Workout>(`${this.apiUrl}`, newWorkout, httpOptionsWithAuth);
  }
 
  DeleteWorkout(id:Number) : Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.delete<Workout>(`${this.apiUrl}/${id}`, httpOptionsWithAuth);
  }

  UpdateWorkout(updateWorkout: Workout, categoryID:Number, id:Number): Observable<Workout>{
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
      return this.httpClient.put<Workout>(`${this.apiUrl}/${id}`, updateWorkout, httpOptionsWithAuth);
  }
}
