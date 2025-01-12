import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  httpOptions = {
     headers: new HttpHeaders({
         ContentType: 'application/json'
     }),
     responseType: 'text' as 'json' 
  }
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('User')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private endPoint = 'https://localhost:7185/api/User/'; 

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginUser: any): Observable<any> {
    return this.http.post<any>(`https://localhost:7185/api/User/Login`, loginUser, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(map(user => {
      if (user && user.token) {
        localStorage.setItem('User', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
      return user;
    }));
  }

  logout() {
    localStorage.removeItem('User');
    this.currentUserSubject.next(null);
  }

  getUserId(): number | null {
    const userId = JSON.parse(localStorage.getItem('User')!).userId;
    return userId ? parseInt(userId, 10) : null;
  }

  changePassword(id: number, changePasswordData: any): Observable<any> { 
    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'text' as 'json' 
    };
    return this.http.post(`${this.endPoint}ChangePassword?id=${id}`, changePasswordData, httpOptionsWithAuth);
  }
}

