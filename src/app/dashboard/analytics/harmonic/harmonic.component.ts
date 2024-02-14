import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/login/auth/auth.service';

HighchartsMore(Highcharts);

@Component({
  selector: 'app-harmonic',
  templateUrl: './harmonic.component.html',
  styleUrls: ['./harmonic.component.css']
})
export class HarmonicComponent implements OnInit, AfterViewInit {

  selectedIntervals: string = '1hour'; 
  selectedDevice: string ='';
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);
  CompanyId!: string | null;
  deviceOptions: any[] = [];
  
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
  date_time: number[] = [];

  constructor(private service: DashboardService,
    public snackBar: MatSnackBar,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchdata();
    this.getUserDevices();
  }

  ngAfterViewInit() {
    this.fetchdata();
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
    this.service.getharmonicdata(this.selectedIntervals).subscribe((result) => {
      this.data = result;

      const istOffset = 5.5 * 60 * 60 * 1000;

      this.thd_v1n = [];
      this.thd_v2n = [];
      this.thd_v3n = [];
      this.thd_v12 = [];
      this.thd_v23 = [];
      this.thd_v31 = [];
      this.thd_i1 = [];
      this.thd_i2 = [];
      this.thd_i3 = [];
      this.date_time = [];

      // Extract and store values from the 'data' array
      this.data.forEach((item: any) => {
        item.data.forEach((dataItem: any) => {
          const datetime = new Date(dataItem.date_time).getTime() + istOffset; // Convert to timestamp

          this.thd_v1n.push(dataItem.thd_v1n);
          this.thd_v2n.push(dataItem.thd_v2n);
          this.thd_v3n.push(dataItem.thd_v3n);
          this.thd_v12.push(dataItem.thd_v12);
          this.thd_v23.push(dataItem.thd_v23);
          this.thd_v31.push(dataItem.thd_v31);
          this.thd_i1.push(dataItem.thd_i1);
          this.thd_i2.push(dataItem.thd_i2);
          this.thd_i3.push(dataItem.thd_i3);
          this.date_time.push(datetime);
        });
      });
      this.HarmonicGraph();
    });
  }

  HarmonicGraph(): void {
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'spline',
        plotBorderWidth: 0,
      },
      title: {
        text: 'Harmonic Chart',
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
        max: 400,
        gridLineWidth: 0,
      },
      legend: {
        symbolRadius: 0,
        verticalAlign: 'top',
      },
      series: [
        { name: 'THD V1N', data: this.thd_v1n.map((value, index) => [this.date_time[index], value]) },
        { name: 'THD V2N', data: this.thd_v2n.map((value, index) => [this.date_time[index], value]) },
        { name: 'THD V3N', data: this.thd_v3n.map((value, index) => [this.date_time[index], value]) },
        { name: 'THD V12', data: this.thd_v12.map((value, index) => [this.date_time[index], value]) },
        { name: 'THD V23', data: this.thd_v23.map((value, index) => [this.date_time[index], value]) },
        { name: 'THD V31', data: this.thd_v31.map((value, index) => [this.date_time[index], value]) },
        { name: 'THD I1', data: this.thd_i1.map((value, index) => [this.date_time[index], value]) },
        { name: 'THD I2', data: this.thd_i2.map((value, index) => [this.date_time[index], value]) },
        { name: 'THD I3', data: this.thd_i3.map((value, index) => [this.date_time[index], value]) },
      ] as any,
    });
  }
}
