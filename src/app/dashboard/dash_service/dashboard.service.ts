import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getuserdetailsdata() {
    throw new Error('Method not implemented.');
  }
  isPageLoading(arg0: boolean) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient, private router: Router) { }

  private readonly API_URL = 'http://localhost:3000';

  deviceDetails(CompanyId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/live-device-detail/${CompanyId}`);
  }

  getuserdata(UserId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/userdetails/${UserId}`);
  }

  getfeederdata(Feeder_Id: string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederdetails/${Feeder_Id}`);
  }
  getalertdata(Threshold: string):Observable<any> {
    return this.http.get(`${this.API_URL}/alerteventsDetail/${Threshold}`);
  }

  getConsuptionGraphdata(): Observable<any>{
    return this.http.get(`${this.API_URL}/feeder/SenseLive`);
  }

  editUserDetails(userId: string, userData: any): Observable<any>{
    return this.http.put(`${this.API_URL}/edituser/${userId}`, userData);
  }

}
