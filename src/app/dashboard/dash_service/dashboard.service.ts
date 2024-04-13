import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private router: Router) {
  }

  private readonly API_URL = 'http://localhost:3000';
  // private readonly API_URL = 'http://ec2-3-110-199-50.ap-south-1.compute.amazonaws.com:3000';

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


 // ${this.API_URL}/feeder/SenseLive?TimeInterval=15min&Shift=ShiftA

// getConsuptiondata(interval:string,shift:string){
//   return this.http.get(`${this.API_URL}/feeder/SenseLive?TimeInterval=${interval}&Shift=${shift}`)
// }

getConsuptiondata(interval:string,shift:string){
  return this.http.get(`${this.API_URL}/feeder/SenseLive?TimeInterval=${interval}&Shift=${shift}`)
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

todReport(data:any): Observable<any> {
  return this.http.post(`${this.API_URL}/todReport`,data)
}

getharmonicdata(interval:string): Observable<any>{
  return this.http.get(`${this.API_URL}/feederharmonic/SenseLive?TimeInterval=${interval}`);
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

  consumptionWithIntervals(DeviceId: string,interval: string,shift_id: string):Observable<any> {
    return this.http.get(`${this.API_URL}/consumptionWithIntervals/${DeviceId}/${interval}/${shift_id}`);
  }

  consumptionWithCustomIntervals(DeviceId: string,start: string, end:string,shift_id: string):Observable<any> {
    return this.http.get(`${this.API_URL}/consumptionWithCustomIntervals/${start}/${end}/${DeviceId}/${shift_id}`);
  }

  getUserById(userId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getUserById/${userId}`);
  }

  updatePassword(personalEmail: string,data: any):Observable<any> {
    return this.http.put(`${this.API_URL}/updatePassword/${personalEmail}`,data);
  }
  
  updateCompany(companyId: string,data: any):Observable<any> {
    return this.http.put(`${this.API_URL}/updateCompany/${companyId}`,data);
  }
  
  getAlertsByFeederId(feederId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getAlertsByFeederId/${feederId}`);
  }
  
  fetchMaxDemand(companyId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/fetchMaxDemand/${companyId}`);
  }

  feederGetDemandBarGraphByInterval(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederGetDemandBarGraphByInterval/${DeviceId}/${interval}`);
  }

  feederGetDemandBarGraphByDate(DeviceId: string,start: string, end:string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederGetDemandBarGraphByDate/${DeviceId}/${start}/${end}`);
  }
  
  feederGetKWHByInterval(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederGetKWHByInterval/${DeviceId}/${interval}`);
  }

  feederGetKWHByDate(DeviceId: string,start: string, end:string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederGetKWHByDate/${DeviceId}/${start}/${end}`);
  }
  
  feederGetKVAHByInterval(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederGetKVAHByInterval/${DeviceId}/${interval}`);
  }

  feederGetKVAHByDate(DeviceId: string,start: string, end:string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederGetKVAHByDate/${DeviceId}/${start}/${end}`);
  }
  
  feederGetKVARHByInterval(DeviceId: string,interval: string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederGetKVARHByInterval/${DeviceId}/${interval}`);
  }

  feederGetKVARHByDate(DeviceId: string,start: string, end:string):Observable<any> {
    return this.http.get(`${this.API_URL}/feederGetKVARHByDate/${DeviceId}/${start}/${end}`);
  }

  getTodayKWHForFeeders(deviceId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getTodayKWHForFeeders/${deviceId}`);
  }

  getYesterdayKWHForFeeders(deviceId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getYesterdayKWHForFeeders/${deviceId}`);
  }

  getThisMonthKWHForFeeders(deviceId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getThisMonthKWHForFeeders/${deviceId}`);
  }

  getPowerParamtersFeeders(deviceId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getPowerParamtersFeeders/${deviceId}`);
  }
}
