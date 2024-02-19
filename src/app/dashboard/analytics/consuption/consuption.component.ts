import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
import { MatSelectChange } from '@angular/material/select';
import { AuthService } from 'src/app/login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

HighchartsMore(Highcharts);

@Component({
  selector: 'app-consuption',
  templateUrl: './consuption.component.html',
  styleUrls: ['./consuption.component.css']
})
export class ConsuptionComponent implements OnInit {
  selectedIntervals: string =''; 
  selectedDevice: string ='';
  selectedShift: string ='';
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);
  
  currentDate: Date = new Date();

  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;
  data: any;

  kvah: number[] = [];
  kwh: number[] = [];
  imp_kvarh: number[] = [];
  exp_kvarh: number[] = [];
  kvarh: number[] = [];
  date_time: string[] = [];
  CompanyId!: string | null;
  initialDevice!: string | null;
  initialShift!: string | null;
  deviceOptions: any[] = [];
  shiftData: any[] = [];

  constructor(
    private service: DashboardService,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private datePipe: DatePipe,) {}

  ngOnInit(): void {
    this.getUserDevices();
  }

  showingData(){
    const device = sessionStorage.getItem('consumptionDevice');
    const interval = sessionStorage.getItem('consumptionInterval');
    const shift = sessionStorage.getItem('consumptionShift');
    const start = sessionStorage.getItem('harmonicsStartDate');
    const forStart = this.datePipe.transform(start, 'yyyy-MM-dd')??'';
    const end = sessionStorage.getItem('harmonicsEndDate');
    const forEnd = this.datePipe.transform(end, 'yyyy-MM-dd')??'';

    if(interval == 'custom'){
      this.selectedIntervals=interval!; 
      this.selectedDevice=device!;
      this.selectedShift=shift!;
      this.startDate = new FormControl(forStart, [Validators.required]);
      this.endDate = new FormControl(forEnd, [Validators.required]);   
    }else{
      this.selectedShift=shift!;
      this.selectedIntervals=interval!; 
      this.selectedDevice=device!;
    }
  }

  previousData(){
    const device = sessionStorage.getItem('consumptionDevice');
    const interval = sessionStorage.getItem('consumptionInterval');
    const shift = sessionStorage.getItem('consumptionShift');

    if(interval == 'custom' && device!=null && device!=undefined && shift!=null && shift!=undefined){
      const start = sessionStorage.getItem('harmonicsStartDate');
      const end = sessionStorage.getItem('harmonicsEndDate');

      if(start && end){
        this.service.consumptionWithCustomIntervals(device,shift,start,end).subscribe((result) => {
          this.data = result.data;
          this.processingData();
        });
      }
      else{
        sessionStorage.setItem('consumptionDevice', this.initialDevice!);
        sessionStorage.setItem('consumptionShift', this.initialShift!);
        sessionStorage.setItem('consumptionInterval', '12hour');
  
        this.service.consumptionWithIntervals(this.initialDevice!,'12hour',this.initialShift!).subscribe((result) => {
          this.data = result.data;
          this.processingData();
        });
      }
    }
    else if(device && device!=null && device!=undefined && interval!=null && interval!=undefined && interval!='custom' && shift!=null && shift!=undefined){
      this.service.consumptionWithIntervals(device,interval,shift).subscribe((result) => {
        this.data = result.data;
        this.processingData();
      });
    }
    else if(device==null || device==undefined || shift==null || shift==undefined){
      sessionStorage.setItem('consumptionDevice', this.initialDevice!);
      sessionStorage.setItem('consumptionShift', this.initialShift!);
      sessionStorage.setItem('consumptionInterval', '12hour');

      this.service.consumptionWithIntervals(this.initialDevice!,'12hour',this.initialShift!).subscribe((result) => {
        this.data = result.data;
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

          if (this.CompanyId) {
            this.service.shiftDetails(this.CompanyId).subscribe(
              (shift: any) => {
                this.shiftData = shift.getDay_Shift;
                this.initialShift = this.shiftData[0].shiftCode;

                this.previousData();
                this.showingData()
              },
              (error) => {
                this.snackBar.open('Error while fetching Shifts Data!', 'Dismiss', {
                  duration: 2000
                });
              }
            );
          }
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
    this.kvah = [];
    this.kwh = [];
    this.imp_kvarh = [];
    this.exp_kvarh = [];
    this.kvarh = [];

    this.kvah = this.data.map((entry: { bucket_start_time: string | number | Date; kvah: any; }) => {
      const timestamp = new Date(entry.bucket_start_time).getTime();
      const kvah = Number(entry.kvah);
      return [timestamp, kvah];
    });
    
    this.kwh = this.data.map((entry: { bucket_start_time: string | number | Date; kwh: any; }) => {
      const timestamp = new Date(entry.bucket_start_time).getTime();
      const kwh = Number(entry.kwh);
      return [timestamp, kwh];
    });
    
    this.imp_kvarh = this.data.map((entry: { bucket_start_time: string | number | Date; imp_kvarh: any; }) => {
      const timestamp = new Date(entry.bucket_start_time).getTime();
      const imp_kvarh = Number(entry.imp_kvarh);
      return [timestamp, imp_kvarh];
    });
    
    this.exp_kvarh = this.data.map((entry: { bucket_start_time: string | number | Date; exp_kvarh: any; }) => {
      const timestamp = new Date(entry.bucket_start_time).getTime();
      const exp_kvarh = Number(entry.exp_kvarh);
      return [timestamp, exp_kvarh];
    });
    
    this.kvarh = this.data.map((entry: { bucket_start_time: string | number | Date; kvarh: any; }) => {
      const timestamp = new Date(entry.bucket_start_time).getTime();
      const kvarh = Number(entry.kvarh);
      return [timestamp, kvarh];
    });     

    this.consumptionGraph();
  }

  fetchdata(): void {
    if (this.selectedIntervals == 'custom' && this.selectedShift && this.selectedDevice && this.startDate.valid && this.endDate.valid) {
      sessionStorage.setItem('consumptionDevice', this.selectedDevice);
      sessionStorage.setItem('consumptionInterval', this.selectedIntervals);
      sessionStorage.setItem('consumptionShift', this.selectedShift);
      sessionStorage.setItem('harmonicsStartDate', this.startDate.value!);
      sessionStorage.setItem('harmonicsEndDate', this.endDate.value!);

      this.service.consumptionWithCustomIntervals(this.selectedDevice,this.selectedShift, this.startDate.value!, this.endDate.value!).subscribe((result) => {
        this.data = result.data;
        this.processingData();
      });

      this.showingData()
    }
    else if(this.selectedDevice && this.selectedShift && this.selectedIntervals && this.selectedIntervals != null && this.selectedIntervals != undefined && this.selectedIntervals!='custom'){
      sessionStorage.setItem('consumptionDevice', this.selectedDevice);
      sessionStorage.setItem('consumptionInterval', this.selectedIntervals);
      sessionStorage.setItem('consumptionShift', this.selectedShift);

      this.service.consumptionWithIntervals(this.selectedDevice,this.selectedIntervals,this.selectedShift).subscribe((result) => {
        this.data = result.data;
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

  consumptionGraph(): void {
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'column',
        plotBorderWidth: 0,
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Consumption Chart'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Values'
        },
        min: 0,
        max: undefined,
        gridLineWidth: 0,
      },
      legend: {
        symbolRadius: 0,
        verticalAlign: 'top',
      },
      series: [
        { type: 'column',name: 'KVAH', data: this.kvah },
        { type: 'column',name: 'KWH', data: this.kwh },
        { type: 'column',name: 'Import Kvarh', data: this.imp_kvarh },
        { type: 'column',name: 'Export Kvarh', data: this.exp_kvarh },
        { type: 'column',name: 'KVARH', data: this.kvarh }
      ]
    });
  }
}
