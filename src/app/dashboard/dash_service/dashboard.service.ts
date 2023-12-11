import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  private deviceIDSubject: BehaviorSubject<string | null>;
  public deviceID$: Observable<string | null>;
  private intervalSubject: BehaviorSubject<string | null>;
  public interval$: Observable<string | null>;
  private StartDateSubject: BehaviorSubject<string | null>;
  public StartDate$: Observable<string | null>;
  private EndDateSubject: BehaviorSubject<string | null>;
  public EndDate$: Observable<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.deviceIDSubject = new BehaviorSubject<string | null>(this.getDeviceId());
    this.deviceID$ = this.deviceIDSubject.asObservable();
    this.intervalSubject = new BehaviorSubject<string | null>(this.getInterval());
    this.interval$ = this.intervalSubject.asObservable();
    this.StartDateSubject = new BehaviorSubject<string | null>(this.getStartDate());
    this.StartDate$ = this.StartDateSubject.asObservable();
    this.EndDateSubject = new BehaviorSubject<string | null>(this.getEndDate());
    this.EndDate$ = this.EndDateSubject.asObservable();
  }

  setDeviceId(deviceID: string) {
    sessionStorage.setItem('deviceID', deviceID);
    this.deviceIDSubject.next(deviceID);
  }

  setInterval(interval: string) {
    sessionStorage.setItem('interval', interval);
    this.intervalSubject.next(interval);
  }

  setStartDate(StartDate: string) {
    sessionStorage.setItem('StartDate', StartDate);
    this.StartDateSubject.next(StartDate);
  }

  setEndDate(EndDate: string) {
    sessionStorage.setItem('EndDate', EndDate);
    this.EndDateSubject.next(EndDate);
  }

  getDeviceId(): string | null {
    return sessionStorage.getItem('deviceID');
  }

  getInterval(): string | null {
    return sessionStorage.getItem('interval');
  }

  getStartDate(): string | null {
    return sessionStorage.getItem('StartDate');
  }

  getEndDate(): string | null {
    return sessionStorage.getItem('EndDate');
  }

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

  getuserdetailsdata() {
    throw new Error('Method not implemented.');
  }
  
  isPageLoading(arg0: boolean) {
    throw new Error('Method not implemented.');
  }

}
