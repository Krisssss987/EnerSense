import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
import { MatSelectChange } from '@angular/material/select';

HighchartsMore(Highcharts);

@Component({
  selector: 'app-consuption',
  templateUrl: './consuption.component.html',
  styleUrls: ['./consuption.component.css']
})
export class ConsuptionComponent implements OnInit, AfterViewInit {

  intervals = [
    { value: '15min', label: '15 min' },
    { value: '30min', label: '30 min' },
    { value: '1hour', label: '1 hour' },
  ];

  shifts = [
    { value: 'ShiftA', label: 'ShiftA' },
    { value: 'ShiftB', label: 'ShiftB' },
  ];

  devices = [
    { value: 'slqoqo', label: 'slqoqo' },
    { value: 'slqoqo1', label: 'slqoqo1' },
  ];

  selectedIntervals: string = '1hour';
  selecteddevice: string = '';
  selectedshift: string = '';

  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;

  data: any;
  devicedata: any;
  devicenames: string[] = [];
  kvah: number[] = [];
  kwh: number[] = [];
  imp_kvarh: number[] = [];
  exp_kvarh: number[] = [];
  kvarh: number[] = [];
  date_time: number[] = [];

  constructor(private service: DashboardService) {}

  ngOnInit(): void {
    this.fetchdata();
    this.fetchdevicedata();
  }

  ngAfterViewInit() {
    this.fetchdata();
    this.fetchdevicedata();
  }

  fetchdata(): void {
    this.service.getConsuptiondata(this.selectedIntervals, this.selectedshift).subscribe((result) => {
      this.data = result;

      // Clear existing arrays
      this.kvah = [];
      this.kwh = [];
      this.imp_kvarh = [];
      this.exp_kvarh = [];
      this.kvarh = [];
      this.date_time = [];

      // Extract and store values from the 'data' array
      this.data.forEach((item: any) => {
        // Assuming 'data' is an array of objects with a 'data' property
        item.data.forEach((dataItem: any) => {
          const datetime = new Date(dataItem.date_time).getTime(); // Convert to timestamp

          this.kvah.push(dataItem.kvah);
          this.kwh.push(dataItem.kwh);
          this.imp_kvarh.push(dataItem.imp_kvarh);
          this.exp_kvarh.push(dataItem.exp_kvarh);
          this.kvarh.push(dataItem.kvarh);
          this.date_time.push(datetime);
        });
      });

      // Map the values to the Highcharts graph
      this.consumptionGraph();
    });
  }

  fetchdevicedata(): void {
    this.service.getdevicename().subscribe((result) => {
      this.devicedata = result;

      // Assuming that each item in the result array has a 'device' property
      this.devices = this.devicedata.map((item: any) => ({
        value: item.device,
        label: item.device,
      }));
      this.devicenames = this.devicedata.map((item: any) => item.device);

      // console.log(this.devicenames);
    });
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

  generateGraph(): void {
    this.fetchdata();
  }
}
