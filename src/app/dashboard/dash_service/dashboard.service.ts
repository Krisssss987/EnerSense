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


 // http://localhost:3000/feeder/SenseLive?TimeInterval=15min&Shift=ShiftA

// getConsuptiondata(interval:string,shift:string){
//   return this.http.get(`${this.API_URL}/feeder/SenseLive?TimeInterval=${interval}&Shift=${shift}`)
// }

getConsuptiondata(interval:string,shift:string){
  return this.http.get(`http://localhost:3000/feeder/SenseLive?TimeInterval=${interval}&Shift=${shift}`)
}


getdevicename(): Observable<any> {
  return this.http.get(`${this.API_URL}/feeder/SenseLive?TimeInterval=1hour`)
}

getParamaterisedData(interval:string){
  return this.http.get(`${this.API_URL}/feederParametrised/SenseLive?TimeInterval=${interval}`)
}

getharmonicdata(interval:string): Observable<any>{
  return this.http.get(`http://localhost:3000/feederharmonic/SenseLive?TimeInterval=${interval}`);
}

getHigestEnergyConsuptionArea(): Observable<any>{
return this.http.get(`${this.API_URL}/fetchHighestKva/SenseLive/1hour`);
}

getLowPF() :Observable <any>{
  return this.http.get(`${this.API_URL}/fetchLowestPF/SenseLive/1hour`);
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

  getMaxvsActuladata(DeviceId:string): Observable<any>{
    return this.http.get(`${this.API_URL}/fetchmaxdemand/${DeviceId}`);
  }

  editUserDetails(userId: string, userData: any): Observable<any>{
    return this.http.put(`${this.API_URL}/edituser/${userId}`, userData);
  }


  getuserdetailsdata() {
    throw new Error('Method not implemented.');
  }
  
  isPageLoading(arg0: boolean) {
    throw new Error('Method not implemented.');
  }

  pieDetails(CompanyId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/piechart/${CompanyId}/${interval}`);
  }

  barDetails(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/Bargraph/${DeviceId}/${interval}`);
  }
  
  feederinterval(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederinterval/${DeviceId}/${interval}`);
  }


}
