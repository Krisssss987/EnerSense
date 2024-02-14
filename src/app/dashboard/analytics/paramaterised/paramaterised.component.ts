import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/login/auth/auth.service';
HighchartsMore(Highcharts);

@Component({
  selector: 'app-paramaterised',
  templateUrl: './paramaterised.component.html',
  styleUrls: ['./paramaterised.component.css']
})
export class ParamaterisedComponent implements OnInit{

  selectedIntervals: string = '1hour'; 
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
  deviceOptions: any[] = [];

  constructor(
    private service: DashboardService,
    public snackBar: MatSnackBar,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchdata();
    this.getUserDevices();
  }

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.service.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.deviceOptions = devices.getFeederData;
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  fetchdata(): void {
    this.service.getParamaterisedData(this.selectedIntervals).subscribe((result) => {
      this.data = result;
      

      // Clear existing arrays
      this.kvavalue = [];
      this.kw = [];
      this.kvar = [];
      this.voltage_l = [];
      this.voltage_n = [];
      this.current = [];
      this.date_time = [];

      // Extract and store values from the 'data' array
      this.data.forEach((item: any) => {
        // Assuming 'data' is an array of objects with a 'data' property
        item.data.forEach((dataItem: any) => {
          this.kvavalue.push(dataItem.kva);
          this.kw.push(dataItem.kw);
          this.kvar.push(dataItem.kvar);
          this.voltage_l.push(dataItem.voltage_l);
          this.voltage_n.push(dataItem.voltage_n);
          this.current.push(dataItem.current);
          this.date_time.push(dataItem.date_time);
        });
      });

      // Map the values to the Highcharts graph
      this.parametrisedGraph();
    });
  }


  parametrisedGraph(): void {
    const seriesData: any[] = [];
  
    // Iterate over each device and create a series for it
    this.data.forEach((item: any, index: number) => {
      const deviceData = item.data;
  
      // Create series for each parameter
      const kvASeries = {
        name: `Device ${index + 1} - ${item.device} - KvA`,
        data: deviceData.map((dataItem: any) => [new Date(dataItem.date_time).getTime(), dataItem.kva]),
      };
  
      const kwSeries = {
        name: `Device ${index + 1} - ${item.device} - KW`,
        data: deviceData.map((dataItem: any) => [new Date(dataItem.date_time).getTime(), dataItem.kw]),
      };
  
      const kvarSeries = {
        name: `Device ${index + 1} - ${item.device} - Kvar`,
        data: deviceData.map((dataItem: any) => [new Date(dataItem.date_time).getTime(), dataItem.kvar]),
      };
  
      const voltageLSeries = {
        name: `Device ${index + 1} - ${item.device} - Voltage L`,
        data: deviceData.map((dataItem: any) => [new Date(dataItem.date_time).getTime(), dataItem.voltage_l]),
      };
  
      const currentSeries = {
        name: `Device ${index + 1} - ${item.device} - Current`,
        data: deviceData.map((dataItem: any) => [new Date(dataItem.date_time).getTime(), dataItem.current]),
      };
  
      const voltageNSeries = {
        name: `Device ${index + 1} - ${item.device} - Voltage N`,
        data: deviceData.map((dataItem: any) => [new Date(dataItem.date_time).getTime(), dataItem.voltage_n]),
      };
  
      // Add series to the array
      seriesData.push(kvASeries, kwSeries, kvarSeries, voltageLSeries, currentSeries, voltageNSeries);
    });
  
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'spline',
        plotBorderWidth: 0,
      },
      title: {
        text: 'Parametrised Chart',
      },
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function () {
            return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', (this.value as number));
          },
        },
      },
      yAxis: {
        title: {
          text: 'Values',
        },
        min: 0,
        max: 500, // Adjust the max value as needed
        gridLineWidth: 0,
      },
      legend: {
        symbolRadius: 0,
        verticalAlign: 'top',
      },
      series: seriesData as any,
    });
  }
  

  onIntervalChange(event: any): void {
    // Log the selected interval value
    // console.log('Selected Interval:', this.selectedIntervals);
  }


  generateGraph(): void {
    this.fetchdata();
  }
}
