import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

@Component({
  selector: 'app-consuption',
  templateUrl: './consuption.component.html',
  styleUrls: ['./consuption.component.css']
})
export class ConsuptionComponent implements OnInit, AfterViewInit {


  feeders =[
    { value: '6 Th Boiler', label: 'O6 Th Boiler' },
    { value: 'air compressor', label: 'air compressor' },
    { value: 'Borewell no 4', label: 'Borewell No 4' }
  ]

  intervals = [
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

  ngOnInit(): void {

  }
  @ViewChild('chart1', { static: false }) chart1Container!: ElementRef;


  ngAfterViewInit() {
    this.consumption(this.chart1Container.nativeElement); 

  }

  consumption(container: HTMLElement) {
    Highcharts.chart(container, {
      chart: {
        type: 'column',
        plotBorderWidth: 1, // Set the plot border width to 1 to add a small thin border
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['Meter 1', 'Meter 2', 'Meter 3', 'Meter 4', 'Meter 5']
      },
      yAxis: {
        title: {
          text: 'KWH'
        },
        min: 0,
        max: 100,
        gridLineWidth: 0,
        plotLines: [
          {
            value: 0,
            color: 'transparent',
            width: 0,
          },
          {
            value: 25,
            color: 'transparent',
            width: 0,
          },
          {
            value: 50,
            color: 'transparent',
            width: 0,
          },
          {
            value: 75,
            color: 'transparent',
            width: 0,
          },
          {
            value: 100,
            color: 'transparent',
            width: 0,
          },
        ]
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          lineWidth: 0,
        }
      },
      legend: {
        symbolRadius: 0,
        verticalAlign: 'top',
      },
      series: [{
        name: 'A shift',
        data: [10, 20, 30, 40, 50]
      }, {
        name: 'B Shift',
        data: [20, 30, 40, 50, 60]
      }] as any
    } as Highcharts.Options);
  }






}


