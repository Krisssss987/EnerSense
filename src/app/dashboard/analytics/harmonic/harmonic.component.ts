import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);


@Component({
  selector: 'app-harmonic',
  templateUrl: './harmonic.component.html',
  styleUrls: ['./harmonic.component.css']
})
export class HarmonicComponent implements OnInit,AfterViewInit{
  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  intervals = [
    { value: 'default', label: 'Default' },
    { value: '1 min', label: '1 min' },
    { value: '5 min', label: '5 min' },
    { value: '15 min', label: '15 min' },
    { value: '30 min', label: '30 min' },
    { value: '1 hour', label: '1 hour' },
  ]
  feeders =[
    { value: 'feeder1', label: 'feeder1' },
    { value: 'feeder2', label: 'feeder2' },
    { value: 'feeder3', label: 'feeder3' },
  ]
  parameters = [
    { value: 'KVA', label: 'KVA' },
    { value: 'kwa', label: 'kwa2' },
    { value: 'kvah', label: 'kvah' },
  ]
  days=[
    { value: 'yesterday', label: 'yesterday' },
    { value: 'last day', label: 'last day' },
    { value: 'last 5 days', label: 'last 5 days' },
    { value: 'date', label: 'date' },
    { value: 'Date and time', label: 'Date and time' },
  ]

  ngOnInit(): void {

  }
 
  @ViewChild('chart3', { static: false }) chart3Container!: ElementRef;


  ngAfterViewInit() {

    this.harmonic(this.chart3Container.nativeElement);

  }

  harmonic(container: HTMLElement) {
    Highcharts.chart(container, {
      chart: {
        type: 'spline',
        plotBorderWidth: 0, // Remove the plot border
      },
      title: {
        text: 'Harmonic Chart'
      },
      xAxis: {
        categories: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E']
      },
      yAxis: {
        title: {
          text: 'Harmonic Values'
        },
        min: 0,
        max: 100,
        gridLineWidth: 0, // Remove the gridlines
      },
      legend: {
        symbolRadius: 0, // Set the symbol radius to 0 to make the legend symbols rectangular
        verticalAlign: 'top', // Position the legends above the graph
      },
      series: [{
        name: 'Harmonic 1',
        data: [15, 25, 35, 45, 55]
      }, {
        name: 'Harmonic 2',
        data: [25, 35, 45, 55, 65]
      }] as any
    } as Highcharts.Options);
  }

}
