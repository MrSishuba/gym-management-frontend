import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RewardTypeViewModel, UnredeemedRewardModel } from '../shared/reward';
import { Observable } from 'rxjs';
import { RewardPostViewModel, RewardRedeemViewModel, RewardSetViewModel, RewardViewModel } from '../shared/reward';

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  constructor(private http: HttpClient) {}
  apiUrl: string = "https://localhost:7185/api/Reward";

  //RewardType endpoints
  createRewardType(rewardType: RewardTypeViewModel): Observable<RewardTypeViewModel> {
    
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<RewardTypeViewModel>(`${this.apiUrl}/createRewardType`, rewardType, httpOptionsWithAuth);
  }

  getAllRewardTypes(): Observable<RewardTypeViewModel[]> {
    return this.http.get<RewardTypeViewModel[]>(`${this.apiUrl}/getAllRewardTypes`, this.httpOptions);
  }

  getRewardTypeById(id: number): Observable<RewardTypeViewModel> {
    return this.http.get<RewardTypeViewModel>(`${this.apiUrl}/getRewardTypeById/${id}`, this.httpOptions);
  }

  updateRewardType(rewardTypeId: number, rewardTypeName: string, rewardCriteria: string): Observable<void> {
    const body = { reward_Type_Name: rewardTypeName, reward_Criteria: rewardCriteria }; // Correctly format the body as JSON
    
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.put<void>(`${this.apiUrl}/updateRewardType/${rewardTypeId}`, body, httpOptionsWithAuth);
  }

  deleteRewardType(id: number): Observable<void> {

    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.delete<void>(`${this.apiUrl}/deleteRewardType/${id}`, httpOptionsWithAuth);
  }

  //Reward endpoints
  getRewardById(id: number): Observable<RewardViewModel> {
    return this.http.get<RewardViewModel>(`${this.apiUrl}/getRewardById/${id}`, this.httpOptions);
  }  

  getAllRewards(): Observable<RewardViewModel[]> {
    return this.http.get<RewardViewModel[]>(`${this.apiUrl}/getAllRewards`, this.httpOptions);
  }

  setReward(reward: RewardSetViewModel): Observable<RewardViewModel> {

    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<RewardViewModel>(`${this.apiUrl}/setReward`, reward, httpOptionsWithAuth);
  }

  redeemReward(reward: RewardRedeemViewModel): Observable<any> {
    
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<any>(`${this.apiUrl}/redeemReward`, reward, httpOptionsWithAuth);
  }

  postReward(reward: RewardPostViewModel): Observable<any> {
    
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<any>(`${this.apiUrl}/postReward`, reward, httpOptionsWithAuth);
  }

  getUnredeemedRewardsForMember(memberId: number): Observable<UnredeemedRewardModel[]> {
    return this.http.get<UnredeemedRewardModel[]>(`${this.apiUrl}/UnredeemedRewards/${memberId}`, this.httpOptions);
  }
}
