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

  constructor(private http: HttpClient, private router: Router) {
    this.deviceIDSubject = new BehaviorSubject<string | null>(this.getDeviceId());
    this.deviceID$ = this.deviceIDSubject.asObservable();
    this.intervalSubject = new BehaviorSubject<string | null>(this.getInterval());
    this.interval$ = this.intervalSubject.asObservable();
  }

  setDeviceId(deviceID: string) {
    sessionStorage.setItem('deviceID', deviceID);
    this.deviceIDSubject.next(deviceID);
  }

  setInterval(interval: string) {
    sessionStorage.setItem('interval', interval);
    this.intervalSubject.next(interval);
  }

  getDeviceId(): string | null {
    return sessionStorage.getItem('deviceID');
  }

  getInterval(): string | null {
    return sessionStorage.getItem('interval');
  }

  private readonly API_URL = 'http://localhost:3000';

  deviceDetails(CompanyId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getFeederData/${CompanyId}`);
  }

  deviceAdd(deviceDetails: any):Observable<any> {
    return this.http.post(`${this.API_URL}/addfeeder`,deviceDetails);
  }

  deviceDelete(feederId: string):Observable<any> {
    return this.http.delete(`${this.API_URL}/delete_feeder/${feederId}`);
  }

  deviceUpdate(feederId: string,newData: any):Observable<any> {
    return this.http.put(`${this.API_URL}/editfeeders/${feederId}`,newData);
  }

  groupDetails(CompanyId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getFeederGroup/${CompanyId}`);
  }

  groupAdd(groupDetails: any):Observable<any> {
    return this.http.post(`${this.API_URL}/insertFeederGroup`,groupDetails);
  }

  groupDelete(groupId: string):Observable<any> {
    return this.http.delete(`${this.API_URL}/deleteQuery/${groupId}`);
  }

  groupUpdate(groupId: string,newData: any):Observable<any> {
    return this.http.put(`${this.API_URL}/updateFeederGroup/${groupId}`,newData);
  }

  userDetails(CompanyId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getUser_Data/${CompanyId}`);
  }

  userAdd(userDetails: any):Observable<any> {
    return this.http.post(`${this.API_URL}/register-user`,userDetails);
  }

  userDelete(userId: string):Observable<any> {
    return this.http.delete(`${this.API_URL}/delete_user/${userId}`);
  }

  userUpdate(userId: string,userDetails: any):Observable<any> {
    return this.http.put(`${this.API_URL}/updateUser/${userId}`,userDetails);
  }
  
  alertDetails(CompanyId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getAlerts/${CompanyId}`);
  }

  alertAdd(alertDetails: any):Observable<any> {
    return this.http.post(`${this.API_URL}/addAlerts`,alertDetails);
  }

  alertDelete(alertId: string):Observable<any> {
    return this.http.delete(`${this.API_URL}/delete_alerts/${alertId}`);
  }

  alertUpdate(alertId: string,alertDetails: any):Observable<any> {
    return this.http.put(`${this.API_URL}/editAlerts/${alertId}`,alertDetails);
  }
  
  shiftDetails(CompanyId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getDay_Shift/${CompanyId}`);
  }

  shiftAdd(shiftDetails: any):Observable<any> {
    return this.http.post(`${this.API_URL}/addShift`,shiftDetails);
  }

  shiftDelete(shiftId: string):Observable<any> {
    return this.http.delete(`${this.API_URL}/delete_shift/${shiftId}`);
  }

  shiftUpdate(shiftId: string,shiftDetails: any):Observable<any> {
    return this.http.put(`${this.API_URL}/editshift/${shiftId}`,shiftDetails);
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

getreportparameters(): Observable<any> {
  return this.http.get(`${this.API_URL}/getArray`)
}

getreport(data:any): Observable<any> {
  return this.http.post(`${this.API_URL}/getReportData`,data)
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
    return this.http.get(`${this.API_URL}/overviewPiechart/${CompanyId}/${interval}`);
  }

  barDetails(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/overviewBargraph/${DeviceId}/${interval}`);
  }

  fetchLatestEntry(DeviceId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/fetchLatestEntry/${DeviceId}`);
  }
  
  feederinterval(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/fetchOverview/${DeviceId}/${interval}`);
  }

  currentoperations(feederId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/currentoperations/${feederId}`);
  }

  voltageoperations(feederId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/voltageoperations/${feederId}`);
  }

  phasevolt(feederId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/phasevolt/${feederId}`);
  }

  overviewSummary(companyId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/overviewSummary/${companyId}`);
  }

  parametersbyinterval(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/parametersbyinterval/${DeviceId}/${interval}`);
  }

  parametersbydate(DeviceId: string,start: string, end:string):Observable<any> {
    const params = { startdate: start, enddate: end };
    return this.http.get(`${this.API_URL}/parametersbydate/${DeviceId}`, { params });
  }

  harmonicsbyinterval(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/harmonicsbyinterval/${DeviceId}/${interval}`);
  }

  harmonicsbydate(DeviceId: string,start: string, end:string):Observable<any> {
    const params = { startdate: start, enddate: end };
    return this.http.get(`${this.API_URL}/harmonicsbydate/${DeviceId}`, { params });
  }
}
