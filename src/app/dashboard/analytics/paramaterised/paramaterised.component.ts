import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
HighchartsMore(Highcharts);

@Component({
  selector: 'app-paramaterised',
  templateUrl: './paramaterised.component.html',
  styleUrls: ['./paramaterised.component.css']
})
export class ParamaterisedComponent implements OnInit, AfterViewInit {
 

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
  selectedDevice: string ='';
  selectedshift:string='ShiftA';

  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;
  data: any;

  kvavalue: number[] = [];
  kw: number[] = [];
  kvar: number[] = [];
  voltage_l: number[] = [];
  voltage_n: number[] = [];
  current: number[] = [];
  date_time: string[] = [];

  constructor(private service: DashboardService) {}

  ngOnInit(): void {
    this.fetchdata();
  }

  ngAfterViewInit() {
    this.fetchdata();
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
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'spline',
        plotBorderWidth: 0, // Remove the plot border
      },
      title: {
        text: 'Parametrised Chart'
      },
      xAxis: {
        categories: this.date_time // Use the extracted date_time values
      },
      yAxis: {
        title: {
          text: 'Values'
        },
        min: 0,
        max: 10,
        gridLineWidth: 0, // Remove the gridlines
      },
      legend: {
        symbolRadius: 0, // Set the symbol radius to 0 to make the legend symbols rectangular
        verticalAlign: 'top', // Position the legends above the graph
      },
      series: [
        {
          name: 'KvA',
          data: this.kvavalue // Use the extracted kva values
        },
        {
          name: 'KW',
          data: this.kw // Use the extracted kw values
        },
        {
          name: 'Kvar',
          data: this.kvar // Use the extracted kvar values
        },
        {
          name: 'voltage_l',
          data: this.voltage_l // Use the extracted kvar values
        },
        {
          name: 'current',
          data: this.current// Use the extracted kvar values
        },
        {
          name: 'voltage_n',
          data: this.voltage_n // Use the extracted kvar values
        },

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
