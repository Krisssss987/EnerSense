import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private router: Router) { }

  private readonly API_URL = 'http://localhost:3000';

  deviceDetails(CompanyId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/live-device-detail/${CompanyId}`);
  }

 
//  getconsuptiondata() :Observable <any>{
//   return this.http.get(`http://localhost:3000/feeder/SenseLive?TimeInterval=1hour`);
//  }
getconsuptiondata(interval: string,selectedDevice:any, selectedshift: string): Observable<any> {
  return this.http.get(`${this.API_URL}/feeder/SenseLive?TimeInterval=${interval}&Shift=${selectedshift}&DeviceIds=${selectedDevice}`)
}
getdevicename(interval: string): Observable<any> {
  return this.http.get(`${this.API_URL}/feeder/SenseLive?TimeInterval=${interval}`)
}



}
