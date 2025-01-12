import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InspectionTypeAndStatusService {
  apiUrl = 'https://localhost:7185/api'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  GetStatuses(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/inspectionStatus/InspectionStatus`)
    .pipe(map(result => result))
  }

  GetTypes(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/inspectionType/InspectionType`)
    .pipe(map(result => result))
  }

}
