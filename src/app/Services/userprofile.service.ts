import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { UserProfile } from '../Models/UserProfile';
import { LoginUser } from '../shared/login-user';
import { User } from '../shared/user';
import { updateUser } from '../shared/update-user';
import { UserTypeViewModel } from '../shared/user-type-vm';
import { UserViewModel } from '../shared/search-user';
import { DeletionSettings } from '../shared/deletionsettings';
import { RegisterEmployee } from '../shared/register-user';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}
  endPoint: string = "https://localhost:7185/api/";

  // Updated method to call RegisterMember endpoint
  RegisterMember(formData: FormData): Observable<any> {
    return this.http.post(`${this.endPoint}User/RegisterMember`, formData);
  }


  registerEmployee(employee: RegisterEmployee, photo: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Name', employee.Name);
    formData.append('Surname', employee.Surname);
    formData.append('Email', employee.Email);
    formData.append('Physical_Address', employee.Physical_Address);
    formData.append('PhoneNumber', employee.PhoneNumber);
    formData.append('Photo', photo);
    formData.append('Password', employee.Password);
    formData.append('Id_Number', employee.Id_Number);
    formData.append('Date_of_Birth', new Date(employee.Date_of_Birth).toISOString());
    formData.append('User_Status_ID', employee.User_Status_ID.toString());
    formData.append('User_Type_ID', employee.User_Type_ID.toString());
    formData.append('Employment_Date', employee.Employment_Date.toISOString());
    formData.append('Hours_Worked', employee.Hours_Worked.toString());
    formData.append('Employee_Type_ID', employee.Employee_Type_ID.toString());
    if (employee.Shift_ID) {
      formData.append('Shift_ID', employee.Shift_ID.toString());
    }

    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post(`${this.endPoint}User/RegisterEmployee`, formData, httpOptionsWithAuth);
  }
  
  LoginUser(loginUser: LoginUser): Observable<User> {
    return this.http.post<User>(`${this.endPoint}User/Login`, loginUser, this.httpOptions);
  }

  getAllUsers(): Observable<UserViewModel[]> {
    return this.http.get<UserViewModel[]>(`${this.endPoint}User/getAllUsers`, this.httpOptions);
  }

  getUserById(userId: number): Observable<updateUser> {
    return this.http.get<updateUser>(`${this.endPoint}User/getUserById/${userId}`)
    .pipe(map(result => result))
  }

  getMemberByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.endPoint}User/GetMemberByUserId/${userId}`, this.httpOptions);
  }

  updateUser(userId: string, user: updateUser, photoFile: File | null): Observable<any> {
    const formData = new FormData();

    formData.append('name', user.name);
    formData.append('surname', user.surname);
    formData.append('email', user.email);
    formData.append('physical_Address', user.physical_Address);
    formData.append('phoneNumber', user.phoneNumber);
    formData.append('user_Type_ID', user.user_Type_ID.toString());

    // Include the photo field even if photoFile is null
    if (photoFile) {
        formData.append('photo', photoFile);
    } else {
        formData.append('photo', user.photo);
    }

    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'text' as 'json'
    };

    return this.http.put(`${this.endPoint}User/editUser/${userId}`, formData, httpOptionsWithAuth);
  }

  deleteUser(userId: number): Observable<string> {

    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.delete<string>(`${this.endPoint}User/deleteUser/${userId}`, httpOptionsWithAuth);
  }
  
  //Activate and Deactivate
  deactivateUser(id: number): Observable<any> {

    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.put(`${this.endPoint}User/DeactivateUser/${id}`, { responseType: 'text' }, httpOptionsWithAuth);
  }

  reactivateUser(id: number): Observable<any> {

    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.put(`${this.endPoint}User/ReactivateUser/${id}`, { responseType: 'text' }, httpOptionsWithAuth);
  }

  //Password EndPoints
  forgotPassword(data: any): Observable<any> {

    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'text' as 'json'
    };
    return this.http.post(`${this.endPoint}User/ForgotPassword`, data, httpOptionsWithAuth);
  }

  resetPassword(data: any): Observable<any> {

    const token = localStorage.getItem('token');
    
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'text' as 'json'
    };

    return this.http.post(`${this.endPoint}User/ResetPassword`, data, httpOptionsWithAuth);
  }

  //UserType EndPoints
  addUserType(userType: UserTypeViewModel): Observable<UserTypeViewModel> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<UserTypeViewModel>(`${this.endPoint}UserType/addUserType`, userType, httpOptionsWithAuth);
  }

  getAllUserTypes(): Observable<UserTypeViewModel[]> {
    return this.http.get<UserTypeViewModel[]>(`${this.endPoint}UserType/getAllUserTypes`, this.httpOptions);
  }

  getUserTypeById(id: number): Observable<UserTypeViewModel> {
    return this.http.get<UserTypeViewModel>(`${this.endPoint}UserType/getUserTypeById/${id}`, this.httpOptions);
  }

  updateUserType(userTypeId: number, userTypeName: string): Observable<void> {
    const body = { user_Type_Name: userTypeName }; // Correctly format the body as JSON

    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.put<void>(`${this.endPoint}UserType/updateUserType/${userTypeId}`, body, httpOptionsWithAuth);
  }

  deleteUserType(id: number): Observable<void> {

    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.delete<void>(`${this.endPoint}UserType/deleteUserType/${id}`, httpOptionsWithAuth);
  }

  //deletion-settings

  // Get Deletion Settings
  getDeletionSettings(): Observable<DeletionSettings> {
    return this.http.get<DeletionSettings>(`${this.endPoint}DeletionSettings/GetDeletionSettings`);
  }
  
  updateDeletionTime(settings: DeletionSettings): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<any>(`${this.endPoint}DeletionSettings/UpdateDeletionTime`, settings, httpOptionsWithAuth);
  }

  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
      errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    return throwError(() => new Error(errorMessage));
  }

}
