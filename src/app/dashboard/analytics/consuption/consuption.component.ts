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
        type: 'column'
      },
      title: {
        text: 'Consumption Chart'
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


