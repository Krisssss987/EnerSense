import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/login/auth/auth.service';
import { DatePipe } from '@angular/common';
HighchartsMore(Highcharts);

@Component({
  selector: 'app-paramaterised',
  templateUrl: './paramaterised.component.html',
  styleUrls: ['./paramaterised.component.css']
})
export class ParamaterisedComponent implements OnInit{

  selectedIntervals: string =''; 
  selectedDevice: string ='';
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);
  
  currentDate: Date = new Date();

  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;
  data: any;

  kvavalue: number[] = [];
  kw: number[] = [];
  kvar: number[] = [];
  voltage_l: number[] = [];
  voltage_n: number[] = [];
  current: number[] = [];
  date_time: string[] = [];
  CompanyId!: string | null;
  initialDevice!: string | null;
  deviceOptions: any[] = [];

  constructor(
    private service: DashboardService,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private datePipe: DatePipe,) {}

  ngOnInit(): void {
    this.getUserDevices();
  }

  showingData(){
    const device = sessionStorage.getItem('parameterisedDevice');
    const interval = sessionStorage.getItem('parameterisedInterval');
    const start = sessionStorage.getItem('parameterisedStartDate');
    const forStart = this.datePipe.transform(start, 'yyyy-MM-dd')??'';
    const end = sessionStorage.getItem('parameterisedEndDate');
    const forEnd = this.datePipe.transform(end, 'yyyy-MM-dd')??'';

    if(interval == 'custom'){
      this.selectedIntervals=interval!; 
      this.selectedDevice=device!;
      this.startDate = new FormControl(forStart, [Validators.required]);
      this.endDate = new FormControl(forEnd, [Validators.required]);   
    }else{
      console.log(device,interval)
      this.selectedIntervals=interval!; 
      this.selectedDevice=device!;
    }
  }

  previousData(){
    const device = sessionStorage.getItem('parameterisedDevice');
    const interval = sessionStorage.getItem('parameterisedInterval');

    if(interval == 'custom' && device!=null && device!=undefined){
      const start = sessionStorage.getItem('parameterisedStartDate');
      const end = sessionStorage.getItem('parameterisedEndDate');

      if(start && end){
        this.service.parametersbydate(device,start,end).subscribe((result) => {
          this.data = result;
          this.processingData();
        });
      }
      else{
        sessionStorage.setItem('parameterisedDevice', device);
        sessionStorage.setItem('parameterisedInterval', '12hour');
  
        this.service.parametersbyinterval(this.initialDevice!,'12hour').subscribe((result) => {
          this.data = result;
          this.processingData();
        });
      }
    }
    else if(device && device!=null && device!=undefined && interval!=null && interval!=undefined && interval!='custom'){
      this.service.parametersbyinterval(device,interval).subscribe((result) => {
        this.data = result;
        this.processingData();
      });
    }
    else{
      sessionStorage.setItem('parameterisedDevice', this.initialDevice!);
      sessionStorage.setItem('parameterisedInterval', '12hour');

      this.service.parametersbyinterval(this.initialDevice!,'12hour').subscribe((result) => {
        this.data = result;
        this.processingData();
      });
    }
  }

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.service.deviceDetails(this.CompanyId).subscribe(
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
    }
  }

  processingData(){
    this.kvavalue = [];
    this.kw = [];
    this.kvar = [];
    this.voltage_l = [];
    this.voltage_n = [];
    this.current = [];
    this.date_time = [];

    this.kvavalue = this.data.map((entry: { bucket_start: string | number | Date; avg_kva: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_kva = Number(entry.avg_kva);
      return [timestamp, avg_kva];
    });
    
    this.kw = this.data.map((entry: { bucket_start: string | number | Date; avg_kw: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_kw = Number(entry.avg_kw);
      return [timestamp, avg_kw];
    });
    
    this.kvar = this.data.map((entry: { bucket_start: string | number | Date; avg_kvar: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_kvar = Number(entry.avg_kvar);
      return [timestamp, avg_kvar];
    });
    
    this.voltage_l = this.data.map((entry: { bucket_start: string | number | Date; avg_vl: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_vl = Number(entry.avg_vl);
      return [timestamp, avg_vl];
    });
    
    this.voltage_n = this.data.map((entry: { bucket_start: string | number | Date; avg_vn: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_vn = Number(entry.avg_vn);
      return [timestamp, avg_vn];
    });
    
    this.current = this.data.map((entry: { bucket_start: string | number | Date; avg_c: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_c = Number(entry.avg_c);
      return [timestamp, avg_c];
    });        

    this.parametrisedGraph();
  }

  fetchdata(): void {
    if (this.selectedIntervals == 'custom' && this.selectedDevice && this.startDate.valid && this.endDate.valid) {
      sessionStorage.setItem('parameterisedDevice', this.selectedDevice);
      sessionStorage.setItem('parameterisedInterval', this.selectedIntervals);
      sessionStorage.setItem('parameterisedStartDate', this.startDate.value!);
      sessionStorage.setItem('parameterisedEndDate', this.endDate.value!);

      this.service.parametersbydate(this.selectedDevice, this.startDate.value!, this.endDate.value!).subscribe((result) => {
        this.data = result;
        this.processingData();
      });

      this.showingData()
    }
    else if(this.selectedDevice && this.selectedIntervals && this.selectedIntervals != null && this.selectedIntervals != undefined && this.selectedIntervals!='custom'){
      sessionStorage.setItem('parameterisedDevice', this.selectedDevice);
      sessionStorage.setItem('parameterisedInterval', this.selectedIntervals);

      this.service.parametersbyinterval(this.selectedDevice,this.selectedIntervals).subscribe((result) => {
        this.data = result;
        this.processingData();
      });

      this.showingData()
    }
    else{
      this.snackBar.open('Select appropriate parameters!', 'Dismiss', {
        duration: 2000
      });
    }
  }

  parametrisedGraph(): void {
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'spline',
        plotBorderWidth: 0,
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Parameterised Chart',
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: 'Values',
        },
        min: 0,
        max: undefined,
        gridLineWidth: 0,
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
      series: [{
        type: 'spline',
        name: 'KVA',
        data: this.kvavalue
      }, {
        type: 'spline',
        name: 'KW',
        data: this.kw
      },{
        type: 'spline',
        name: 'KVAR',
        data: this.kvar
      }, {
        type: 'spline',
        name: 'Voltage L',
        data: this.voltage_l
      },{
        type: 'spline',
        name: 'Voltage N',
        data: this.voltage_n
      }, {
        type: 'spline',
        name: 'Current',
        data: this.current
      }
    ],
    });
  }
}
