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
  


}
