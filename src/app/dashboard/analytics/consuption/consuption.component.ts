import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
import { MatSelectChange } from '@angular/material/select';
import { AuthService } from 'src/app/login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';

HighchartsMore(Highcharts);

@Component({
  selector: 'app-consuption',
  templateUrl: './consuption.component.html',
  styleUrls: ['./consuption.component.css']
})
export class ConsuptionComponent implements OnInit {
  selectedIntervals: string = '';
  selectedDevice: string = '';
  selectedShift: string = '';
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);

  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;

  CompanyId!: string | null;
  deviceOptions: any[] = [];
  devicenames: string[] = [];
  kvah: number[] = [];
  kwh: number[] = [];
  imp_kvarh: number[] = [];
  exp_kvarh: number[] = [];
  kvarh: number[] = [];
  date_time: number[] = [];
  shiftData: any;
  
  currentDate: Date = new Date();

  constructor(
    private authService: AuthService,
    private service: DashboardService,
    public snackBar: MatSnackBar,
    ) {}

  ngOnInit(): void {
    this.fetchdata();
    this.getUserDevices();
    this.getShift();
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

  getShift() {
    const CompanyId = this.authService.getCompanyId();
    if (CompanyId) {
      this.service.shiftDetails(CompanyId).subscribe(
        (shift: any) => {
          this.shiftData = shift.getDay_Shift;
        },
        (error) => {
          this.snackBar.open('Error while fetching Shifts Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  fetchdata(): void {
  }

  consumptionGraph(): void {
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'column',
       
        plotBorderWidth: 0,
      },
      title: {
        text: 'Consumption Chart'
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
          text: 'Values'
        },
        min: 0,
        max: 10000,
        gridLineWidth: 0,
      },
      legend: {
        symbolRadius: 0,
        verticalAlign: 'top',
      },
      series: [
        { name: 'KVAh', data: this.kvah.map((value, index) => [this.date_time[index], value]) },
        { name: 'KWh', data: this.kwh.map((value, index) => [this.date_time[index], value]) },
        { name: 'Import Kvarh', data: this.imp_kvarh.map((value, index) => [this.date_time[index], value]) },
        { name: 'Export Kvarh', data: this.exp_kvarh.map((value, index) => [this.date_time[index], value]) },
        { name: 'Kvarh', data: this.kvarh.map((value, index) => [this.date_time[index], value]) },
      ] as any
    });
  }
}
