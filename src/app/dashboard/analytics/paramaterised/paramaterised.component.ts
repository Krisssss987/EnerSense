import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/authentication/auth/auth.service';
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
  selectedParameter: string ='';
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);
  
  currentDate: Date = new Date();

  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;
  data: any;

  CompanyId!: string | null;
  initialDevice!: string | null;
  deviceOptions: any[] = [];
  graphdata:any;

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
    const parameter = sessionStorage.getItem('parameterisedParameter');
    const start = sessionStorage.getItem('parameterisedStartDate');
    const forStart = this.datePipe.transform(start, 'yyyy-MM-dd')??'';
    const end = sessionStorage.getItem('parameterisedEndDate');
    const forEnd = this.datePipe.transform(end, 'yyyy-MM-dd')??'';

    if(interval == 'custom'){
      this.selectedIntervals=interval!; 
      this.selectedDevice=device!;
      this.selectedParameter=parameter!;
      this.startDate = new FormControl(forStart, [Validators.required]);
      this.endDate = new FormControl(forEnd, [Validators.required]);   
    }else{
      console.log(device,interval)
      this.selectedIntervals=interval!; 
      this.selectedDevice=device!;
      this.selectedParameter=parameter!;
    }
  }

  previousData(){
    const device = sessionStorage.getItem('parameterisedDevice');
    const interval = sessionStorage.getItem('parameterisedInterval');
    const parameter = sessionStorage.getItem('parameterisedParameter');

    if(interval == 'custom' && device!=null && device!=undefined && parameter!=null && parameter!=undefined){
      const start = sessionStorage.getItem('parameterisedStartDate');
      const end = sessionStorage.getItem('parameterisedEndDate');

      if(start && end){
        this.service.parametersbydate(device,start,end).subscribe((result) => {
          this.data = result;
          this.processingData(this.data,parameter!);
        });
      }
      else{
        sessionStorage.setItem('parameterisedDevice', device);
        sessionStorage.setItem('parameterisedInterval', '12hour');
  
        this.service.parametersbyinterval(this.initialDevice!,'12hour').subscribe((result) => {
          this.data = result;
          this.processingData(this.data,parameter);
        });
      }
    }
    else if(device && device!=null && device!=undefined && parameter && parameter!=null && parameter!=undefined && interval!=null && interval!=undefined && interval!='custom'){
      this.service.parametersbyinterval(device,interval).subscribe((result) => {
        this.data = result;
        this.processingData(this.data,parameter);
      });
    }
    else{
      sessionStorage.setItem('parameterisedDevice', this.initialDevice!);
      sessionStorage.setItem('parameterisedInterval', '12hour');
      sessionStorage.setItem('parameterisedParameter', 'power');

      this.service.parametersbyinterval(this.initialDevice!,'12hour').subscribe((result) => {
        this.data = result;
        this.processingData(this.data,'power');
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

  processingData(data:any,parameter:string){
    let kvavalue = [];
    let kw = [];
    let kvar = [];
    let pf = [];
    let current = [];
    let current_1 = [];
    let current_2 = [];
    let current_3 = [];
    let voltage_n = [];
    let voltage_1n = [];
    let voltage_2n = [];
    let voltage_3n = [];
    let voltage_l = [];
    let voltage_31 = [];
    let voltage_23 = [];
    let voltage_12 = [];
    
    for (let i = 0; i < data.length; i++) {
      const date = new Date(data[i].bucket_start);
    
      date.setHours(date.getHours() + 5);
      date.setMinutes(date.getMinutes() + 30);
    
      data[i].bucket_start = date.toISOString();
    }

    kvavalue = data.map((entry: { bucket_start: string | number | Date; avg_kva: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_kva = Number(entry.avg_kva);
      return [timestamp, avg_kva];
    });
    
    kw = data.map((entry: { bucket_start: string | number | Date; avg_kw: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_kw = Number(entry.avg_kw);
      return [timestamp, avg_kw];
    });
    
    kvar = data.map((entry: { bucket_start: string | number | Date; avg_kvar: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_kvar = Number(entry.avg_kvar);
      return [timestamp, avg_kvar];
    });

    pf = data.map((entry: { bucket_start: string | number | Date; avg_pf: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_pf = Number(entry.avg_pf);
      return [timestamp, avg_pf];
    });
    
    current = data.map((entry: { bucket_start: string | number | Date; avg_c: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_c = Number(entry.avg_c);
      return [timestamp, avg_c];
    }); 
    
    current_1 = data.map((entry: { bucket_start: string | number | Date; avg_current_1: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_current_1 = Number(entry.avg_current_1);
      return [timestamp, avg_current_1];
    });
    
    current_2 = data.map((entry: { bucket_start: string | number | Date; avg_current_2: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_current_2 = Number(entry.avg_current_2);
      return [timestamp, avg_current_2];
    });
    
    current_3 = data.map((entry: { bucket_start: string | number | Date; avg_current_3: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_current_3 = Number(entry.avg_current_3);
      return [timestamp, avg_current_3];
    });  
    
    voltage_n = data.map((entry: { bucket_start: string | number | Date; avg_vn: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_vn = Number(entry.avg_vn);
      return [timestamp, avg_vn];
    }); 
    
    voltage_1n = data.map((entry: { bucket_start: string | number | Date; avg_voltage_1n: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_voltage_1n = Number(entry.avg_voltage_1n);
      return [timestamp, avg_voltage_1n];
    }); 
    
    voltage_2n = data.map((entry: { bucket_start: string | number | Date; avg_voltage_2n: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_voltage_2n = Number(entry.avg_voltage_2n);
      return [timestamp, avg_voltage_2n];
    }); 
    
    voltage_3n = data.map((entry: { bucket_start: string | number | Date; avg_voltage_3n: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_voltage_3n = Number(entry.avg_voltage_3n);
      return [timestamp, avg_voltage_3n];
    }); 
    
    voltage_l = data.map((entry: { bucket_start: string | number | Date; avg_vl: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_vl = Number(entry.avg_vl);
      return [timestamp, avg_vl];
    });  
    
    voltage_31 = data.map((entry: { bucket_start: string | number | Date; avg_voltage_12: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_voltage_12 = Number(entry.avg_voltage_12);
      return [timestamp, avg_voltage_12];
    }); 
    
    voltage_23 = data.map((entry: { bucket_start: string | number | Date; avg_voltage_23: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_voltage_23 = Number(entry.avg_voltage_23);
      return [timestamp, avg_voltage_23];
    }); 
    
    voltage_12 = data.map((entry: { bucket_start: string | number | Date; avg_voltage_31: any; }) => {
      const timestamp = new Date(entry.bucket_start).getTime();
      const avg_voltage_31 = Number(entry.avg_voltage_31);
      return [timestamp, avg_voltage_31];
    }); 

    if(parameter=='power'){ 
      this.graphdata=[{
        type: 'spline',
        name: 'KVA',
        data: kvavalue
      }, {
        type: 'spline',
        name: 'KW',
        data: kw
      },{
        type: 'spline',
        name: 'KVAR',
        data: kvar
      }]
    } else if(parameter=='pf'){ 
      this.graphdata=[{
        type: 'spline',
        name: 'PF',
        data: pf
      }]
    } else if(parameter=='current'){ 
      this.graphdata=[{
        type: 'spline',
        name: 'Current',
        data: current
      }, {
        type: 'spline',
        name: 'Current 1',
        data: current_1
      },{
        type: 'spline',
        name: 'Current 2',
        data: current_2
      },{
        type: 'spline',
        name: 'Current 3',
        data: current_3
      }]
    } else if(parameter=='voltage_l'){ 
      this.graphdata=[{
        type: 'spline',
        name: 'Voltage L',
        data: voltage_l
      }, {
        type: 'spline',
        name: 'Voltage 31',
        data: voltage_31
      },{
        type: 'spline',
        name: 'Voltage 23',
        data: voltage_23
      },{
        type: 'spline',
        name: 'Voltage 12',
        data: voltage_12
      }]
    } else if(parameter=='voltage_n'){ 
      this.graphdata=[{
        type: 'spline',
        name: 'Voltage N',
        data: voltage_n
      }, {
        type: 'spline',
        name: 'Voltage 1N',
        data: voltage_1n
      },{
        type: 'spline',
        name: 'Voltage 2N',
        data: voltage_2n
      },{
        type: 'spline',
        name: 'Voltage 3N',
        data: voltage_3n
      }]
    }

    this.parametrisedGraph();
  }

  fetchdata(): void {
    if (this.selectedIntervals == 'custom' && this.selectedDevice && this.selectedParameter && this.startDate.valid && this.endDate.valid) {
      sessionStorage.setItem('parameterisedDevice', this.selectedDevice);
      sessionStorage.setItem('parameterisedInterval', this.selectedIntervals);
      sessionStorage.setItem('parameterisedStartDate', this.startDate.value!);
      sessionStorage.setItem('parameterisedEndDate', this.endDate.value!);
      sessionStorage.setItem('parameterisedParameter', this.selectedParameter);

      this.service.parametersbydate(this.selectedDevice, this.startDate.value!, this.endDate.value!).subscribe((result) => {
        this.data = result;
        this.processingData(this.data,this.selectedParameter);
      });

      this.showingData()
    }
    else if(this.selectedDevice && this.selectedParameter && this.selectedIntervals && this.selectedIntervals != null && this.selectedIntervals != undefined && this.selectedIntervals!='custom'){
      sessionStorage.setItem('parameterisedDevice', this.selectedDevice);
      sessionStorage.setItem('parameterisedInterval', this.selectedIntervals);
      sessionStorage.setItem('parameterisedParameter', this.selectedParameter);

      this.service.parametersbyinterval(this.selectedDevice,this.selectedIntervals).subscribe((result) => {
        this.data = result;
        this.processingData(this.data,this.selectedParameter);
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
      series: this.graphdata
    ,
    });
  }
}
