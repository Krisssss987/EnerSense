import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/authentication/auth/auth.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

HighchartsMore(Highcharts);

@Component({
  selector: 'app-harmonic',
  templateUrl: './harmonic.component.html',
  styleUrls: ['./harmonic.component.css']
})
export class HarmonicComponent implements OnInit {

  selectedIntervals: string =''; 
  selectedDevice: string ='';
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);
  
  currentDate: Date = new Date();

  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;
  data: any;

  thd_v1n: number[] = [];
  thd_v2n: number[] = [];
  thd_v3n: number[] = [];
  thd_v12: number[] = [];
  thd_v23: number[] = [];
  thd_v31: number[] = [];
  thd_i1: number[] = [];
  thd_i2: number[] = [];
  thd_i3: number[] = [];
  date_time: string[] = [];
  CompanyId!: string | null;
  initialDevice!: string | null;
  deviceOptions: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private service: DashboardService,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private datePipe: DatePipe,) {}

  ngOnInit(): void {
    this.getUserDevices();
  }

  ngOnDestroy(){
    this.unsubscribeFromTopics();
  }
  
  unsubscribeFromTopics() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  showingData(){
    const device = sessionStorage.getItem('harmonicsDevice');
    const interval = sessionStorage.getItem('harmonicsInterval');
    const start = sessionStorage.getItem('harmonicsStartDate');
    const forStart = this.datePipe.transform(start, 'yyyy-MM-dd')??'';
    const end = sessionStorage.getItem('harmonicsEndDate');
    const forEnd = this.datePipe.transform(end, 'yyyy-MM-dd')??'';

    if(interval == 'custom'){
      this.selectedIntervals=interval!; 
      this.selectedDevice=device!;
      this.startDate = new FormControl(forStart, [Validators.required]);
      this.endDate = new FormControl(forEnd, [Validators.required]);   
    }else{
      this.selectedIntervals=interval!; 
      this.selectedDevice=device!;
    }
  }

  previousData(){
    const device = sessionStorage.getItem('harmonicsDevice');
    const interval = sessionStorage.getItem('harmonicsInterval');

    if(interval == 'custom' && device!=null && device!=undefined){
      const start = sessionStorage.getItem('harmonicsStartDate');
      const end = sessionStorage.getItem('harmonicsEndDate');

      if(start && end){
        const subscription =this.service.harmonicsbydate(device,start,end).subscribe((result) => {
          this.data = result;
          this.processingData(this.data);
        });
        this.subscriptions.push(subscription)
      }
      else{
        sessionStorage.setItem('harmonicsDevice', device);
        sessionStorage.setItem('harmonicsInterval', '12hour');
  
        const subscription =this.service.harmonicsbyinterval(this.initialDevice!,'12hour').subscribe((result) => {
          this.data = result;
          this.processingData(this.data);
        });
        this.subscriptions.push(subscription)
      }
    }
    else if(device && device!=null && device!=undefined && interval!=null && interval!=undefined && interval!='custom'){
      const subscription = this.service.harmonicsbyinterval(device,interval).subscribe((result) => {
        this.data = result;
        this.processingData(this.data);
      });
      this.subscriptions.push(subscription)
    }
    else{
      sessionStorage.setItem('harmonicsDevice', this.initialDevice!);
      sessionStorage.setItem('harmonicsInterval', '12hour');

      const subscription = this.service.harmonicsbyinterval(this.initialDevice!,'12hour').subscribe((result) => {
        this.data = result;
        this.processingData(this.data);
      });
      this.subscriptions.push(subscription)
    }
  }

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      const subscription = this.service.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.deviceOptions = devices.getFeederData;
          this.initialDevice = this.deviceOptions[0].feederUid;
          this.previousData();
          this.showingData()
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
      this.subscriptions.push(subscription)
    }
  }

  processingData(data:any){
    this.thd_v1n = [];
    this.thd_v2n = [];
    this.thd_v3n = [];
    this.thd_v12 = [];
    this.thd_v23 = [];
    this.thd_v31 = [];
    this.thd_i1 = [];
    this.thd_i2 = [];
    this.thd_i3 = [];

    for (let i = 0; i < data.length; i++) {
      const date = new Date(data[i].bucket_start);
    
      date.setHours(date.getHours() + 5);
      date.setMinutes(date.getMinutes() + 30);
    
      data[i].bucket_start = date.toISOString();
    }

    this.thd_v1n = data.map((entry: { bucket_start: string | number | Date; avg_thd_v1n: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_thd_v1n = Number(entry.avg_thd_v1n);
      return [timestamp, avg_thd_v1n];
    });
    
    this.thd_v2n = data.map((entry: { bucket_start: string | number | Date; avg_thd_v2n: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_thd_v2n = Number(entry.avg_thd_v2n);
      return [timestamp, avg_thd_v2n];
    });
    
    this.thd_v3n = data.map((entry: { bucket_start: string | number | Date; avg_thd_v3n: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_thd_v3n = Number(entry.avg_thd_v3n);
      return [timestamp, avg_thd_v3n];
    });
    
    this.thd_v12 = data.map((entry: { bucket_start: string | number | Date; avg_thd_v12: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_thd_v12 = Number(entry.avg_thd_v12);
      return [timestamp, avg_thd_v12];
    });
    
    this.thd_v23 = data.map((entry: { bucket_start: string | number | Date; avg_thd_v23: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_thd_v23 = Number(entry.avg_thd_v23);
      return [timestamp, avg_thd_v23];
    });
    
    this.thd_v31 = data.map((entry: { bucket_start: string | number | Date; avg_thd_v31: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_thd_v31 = Number(entry.avg_thd_v31);
      return [timestamp, avg_thd_v31];
    }); 
    
    this.thd_i1 = data.map((entry: { bucket_start: string | number | Date; avg_thd_i1: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_thd_i1 = Number(entry.avg_thd_i1);
      return [timestamp, avg_thd_i1];
    });
    
    this.thd_i2 = data.map((entry: { bucket_start: string | number | Date; avg_thd_i2: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_thd_i2 = Number(entry.avg_thd_i2);
      return [timestamp, avg_thd_i2];
    });
    
    this.thd_i3 = data.map((entry: { bucket_start: string | number | Date; avg_thd_i3: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_thd_i3 = Number(entry.avg_thd_i3);
      return [timestamp, avg_thd_i3];
    });        

    this.HarmonicGraph();
  }

  fetchdata(): void {
    if (this.selectedIntervals == 'custom' && this.selectedDevice && this.startDate.valid && this.endDate.valid) {
      sessionStorage.setItem('harmonicsDevice', this.selectedDevice);
      sessionStorage.setItem('harmonicsInterval', this.selectedIntervals);
      sessionStorage.setItem('harmonicsStartDate', this.startDate.value!);
      sessionStorage.setItem('harmonicsEndDate', this.endDate.value!);

      const subscription = this.service.harmonicsbydate(this.selectedDevice, this.startDate.value!, this.endDate.value!).subscribe((result) => {
        this.data = result;
        this.processingData(this.data);
      });
      this.subscriptions.push(subscription)

      this.showingData()
    }
    else if(this.selectedDevice && this.selectedIntervals && this.selectedIntervals != null && this.selectedIntervals != undefined && this.selectedIntervals!='custom'){
      sessionStorage.setItem('harmonicsDevice', this.selectedDevice);
      sessionStorage.setItem('harmonicsInterval', this.selectedIntervals);

      const subscription = this.service.harmonicsbyinterval(this.selectedDevice,this.selectedIntervals).subscribe((result) => {
        this.data = result;
        this.processingData(this.data);
      });
      this.subscriptions.push(subscription)

      this.showingData()
    }
    else{
      this.snackBar.open('Select appropriate parameters!', 'Dismiss', {
        duration: 2000
      });
    }
  }

  HarmonicGraph(): void {
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'spline',
        plotBorderWidth: 0,
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Harmonic Chart',
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: 'Values',
        },
      },
      legend: {
        symbolRadius: 0,
        verticalAlign: 'top',
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        }
      },
      series: [
        { type: 'spline',name: 'THD V1N', data: this.thd_v1n },
        { type: 'spline',name: 'THD V2N', data: this.thd_v2n },
        { type: 'spline',name: 'THD V3N', data: this.thd_v3n },
        { type: 'spline',name: 'THD V12', data: this.thd_v12 },
        { type: 'spline',name: 'THD V23', data: this.thd_v23 },
        { type: 'spline',name: 'THD V31', data: this.thd_v31 },
        { type: 'spline',name: 'THD I1', data: this.thd_i1 },
        { type: 'spline',name: 'THD I2', data: this.thd_i2 },
        { type: 'spline',name: 'THD I3', data: this.thd_i3 },
      ],
    });
  }
}
