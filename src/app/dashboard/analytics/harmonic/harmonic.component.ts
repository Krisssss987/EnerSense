import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';

HighchartsMore(Highcharts);

@Component({
  selector: 'app-harmonic',
  templateUrl: './harmonic.component.html',
  styleUrls: ['./harmonic.component.css']
})
export class HarmonicComponent implements OnInit, AfterViewInit {

  intervals = [
    { value: '15min', label: '15 min' },
    { value: '30min', label: '30 min' },
    { value: '1hour', label: '1 hour' },
  ];

  shifts = [
    { value: 'Shift A', label: 'Shift A' },
    { value: 'Shift B', label: 'Shift B' },
  ];

  selectedIntervals: string = '1hour';
  selectedDevice: string = '';
  selectedshift: string = 'ShiftA';

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

  constructor(private service: DashboardService) { }

  ngOnInit(): void {
    this.fetchdata();
  }

  ngAfterViewInit() {
    this.fetchdata();
  }

  fetchdata(): void {
    this.service.getharmonicdata(this.selectedIntervals).subscribe((result) => {
      this.data = result;

      const istOffset = 5.5 * 60 * 60 * 1000;

      // Clear existing arrays
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
        // Assuming 'data' is an array of objects with a 'data' property
        item.data.forEach((dataItem: any) => {
          this.thd_v1n.push(dataItem.thd_v1n);
          this.thd_v2n.push(dataItem.thd_v2n);
          this.thd_v3n.push(dataItem.thd_v3n);
          this.thd_v12.push(dataItem.thd_v12);
          this.thd_v23.push(dataItem.thd_v23);
          this.thd_v31.push(dataItem.thd_v31);
          this.thd_i1.push(dataItem.thd_i1);
          this.thd_i2.push(dataItem.thd_i2);
          this.thd_i3.push(dataItem.thd_i3);
          this.date_time.push(dataItem.date_time + istOffset);
        });
      });

      // Map the values to the Highcharts graph
      this.HarmonicGraph();
    });
  }

  HarmonicGraph(): void {
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'spline',
        plotBorderWidth: 0, // Remove the plot border
      },
      title: {
        text: 'Harmonic Chart'
      },
      xAxis: {
        categories: this.date_time // Use the extracted date_time values
      },
      yAxis: {
        title: {
          text: 'Values'
        },
        min: 0,
        // You may want to adjust the max value based on your data
        max: 10,
        gridLineWidth: 0, // Remove the gridlines
      },
      legend: {
        symbolRadius: 0, // Set the symbol radius to 0 to make the legend symbols rectangular
        verticalAlign: 'top', // Position the legends above the graph
      },
      series: [
        { name: 'THD V1N', data: this.thd_v1n },
        { name: 'THD V2N', data: this.thd_v2n },
        { name: 'THD V3N', data: this.thd_v3n },
        { name: 'THD V12', data: this.thd_v12 },
        { name: 'THD V23', data: this.thd_v23 },
        { name: 'THD V31', data: this.thd_v31 },
        { name: 'THD I1', data: this.thd_i1 },
        { name: 'THD I2', data: this.thd_i2 },
        { name: 'THD I3', data: this.thd_i3 },
        // Add more series for other parameters if needed
      ] as any
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
