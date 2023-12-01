import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);


@Component({
  selector: 'app-paramaterised',
  templateUrl: './paramaterised.component.html',
  styleUrls: ['./paramaterised.component.css']
})
export class ParamaterisedComponent implements OnInit, AfterViewInit {
  
  options = [
    { value: '6 Th Boiler', label: 'O6 Th Boiler' },
    { value: 'air compressor', label: 'air compressor' },
    { value: 'Borewell no 4', label: 'Borewell No 4' }
  ];

  intervals = [
    { value: 'default', label: 'Default' },
    { value: '1 min', label: '1 min' },
    { value: '5 min', label: '5 min' },
    { value: '15 min', label: '15 min' },
    { value: '30 min', label: '30 min' },
    { value: '1 hour', label: '1 hour' },
  ]
  intervaldays = [
    { value: 'Yesterday', label: 'Yesterday' },
    { value: 'This Month', label: 'This Month' },
    { value: 'Last Month', label: 'Last Month' },
    { value: 'Date', label: 'Date' },
    { value: 'Date&Time', label:'Date&Time' },
  ]
  shifts =[
    { value: 'Shift A', label: 'Shift A' },
    { value: 'Shift B', label: 'Shift B' },
  ]


  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;


  ngOnInit(): void {  }

  ngAfterViewInit() {
    this.parametrised(this.chart2Container.nativeElement);
  }

  parametrised(container: HTMLElement) {
    Highcharts.chart(container, {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Parametrised Chart'
      },
      xAxis: {
        categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
      },
      yAxis: {
        title: {
          text: 'Values'
        },
        min: 0,
        max: 100,
      },
      series: [{
        name: 'KvA',
        data: [30, 40, 50, 60, 70]
      }, {
        name: 'KWAh',
        data: [40, 50, 60, 70, 80]
      }] as any
    } as Highcharts.Options);
  }

  

}