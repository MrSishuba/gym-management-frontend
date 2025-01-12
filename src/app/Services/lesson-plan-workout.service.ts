import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { LessonPlanWorkout } from '../shared/lessonPlanWorkout';

@Injectable({
  providedIn: 'root'
})
export class LessonPlanWorkoutService {

 
  apiUrl = 'https://localhost:7185/api/lessonPlan/LessonPlan'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  GetPlansWorkouts(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}`)
    .pipe(map(result => result))
  }

  GetPlanWorkout(id:Number): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/${id}`)
    .pipe(map(result => result))
  }

  AddPlanWorkout(newPlanWorkout: LessonPlanWorkout): Observable<LessonPlanWorkout>{
    return this.httpClient.post<LessonPlanWorkout>(`${this.apiUrl}`, newPlanWorkout, this.httpOptions);
  }
 
  DeletePlanWorkout(id:Number) : Observable<any> {
    return this.httpClient.delete<LessonPlanWorkout>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  UpdatePlanWorkout(updatePlanWorkout: LessonPlanWorkout, id:Number): Observable<LessonPlanWorkout>{
   // console.log(updateCategory);
   
      return this.httpClient.put<LessonPlanWorkout>(`${this.apiUrl}/${id}`, updatePlanWorkout, this.httpOptions);
  }


}
