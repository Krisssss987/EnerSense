import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dash_service/dashboard.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { MatSelectChange } from '@angular/material/select'; // Import MatSelectChange
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

  devices =[
    { value: 'slqoqo', label: 'slqoqo' },
    { value: 'slqoqo1', label: 'slqoqo1' },
  ];


  selectedIntervals: string = '1hour';
  selecteddevice: string = '';
  selectedshift: string = '';

  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;

  data: any;
  devicedata:any;
  devicenames: string[] = [];
  kvah: number[] = [];
  kwh: number[] = [];
  imp_kvarh: number[] = [];
  exp_kvarh: number[] = [];
  kvarh: number[] = [];
  date_time: string[] = [];

  constructor(private service: DashboardService) {}

  ngOnInit(): void {
    this.fetchdata();
  }

  ngAfterViewInit() {
    this.fetchdata();
    this.fetchdevicedata();
  }

  fetchdata(): void {
    this.service.getConsuptiondata(this.selectedIntervals,this.selectedshift).subscribe((result) => {
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
          this.kvah.push(dataItem.kvah);
          this.kwh.push(dataItem.kwh);
          this.imp_kvarh.push(dataItem.imp_kvarh);
          this.exp_kvarh.push(dataItem.exp_kvarh);
          this.kvarh.push(dataItem.kvarh);
          this.date_time.push(dataItem.date_time);
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

    console.log(this.devicenames);
  });
}

  consumptionGraph(): void {
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'column',
        plotBorderWidth: 0, // Remove the plot border
      },
      title: {
        text: 'Consumption Chart'
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
        { name: 'KVAh', data: this.kvah },
        { name: 'KWh', data: this.kwh },
        { name: 'Import Kvarh', data: this.imp_kvarh },
        { name: 'Export Kvarh', data: this.exp_kvarh },
        { name: 'Kvarh', data: this.kvarh },
      ] as any
    });
  }

  // onIntervalChange(event: MatSelectChange): void {
  //   // Log the selected interval value
  //   this.selectedIntervals = event.value;
  //   console.log('Selected Interval:', this.selectedIntervals);
  // }

  generateGraph(): void {
    this.fetchdata();
  }
}
