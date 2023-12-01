import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {

  }
  @ViewChild('chart1', { static: false }) chart1Container!: ElementRef;
  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;
  @ViewChild('chart3', { static: false }) chart3Container!: ElementRef;
  @ViewChild('chart4', { static: false }) chart4Container!: ElementRef;

  // ... existing code

  ngAfterViewInit() {
    this.consumption(this.chart1Container.nativeElement); // Pass the element to the function
    this.parametrised(this.chart2Container.nativeElement);
    this.harmonic(this.chart3Container.nativeElement);
    this.quickAnalysis(this.chart4Container.nativeElement);
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

  parametrised(container: HTMLElement) {
    Highcharts.chart(container, {
      chart: {
        type: 'column'
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
        name: 'Parameter 1',
        data: [30, 40, 50, 60, 70]
      }, {
        name: 'Parameter 2',
        data: [40, 50, 60, 70, 80]
      }] as any
    } as Highcharts.Options);
  }

  harmonic(container: HTMLElement) {
    Highcharts.chart(container, {
      chart: {
        type: 'column'
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

  quickAnalysis(container: HTMLElement) {
    Highcharts.chart(container, {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Quick Analysis Chart'
      },
      xAxis: {
        categories: ['Analysis X', 'Analysis Y', 'Analysis Z', 'Analysis W', 'Analysis V']
      },
      yAxis: {
        title: {
          text: 'Analysis Values'
        },
        min: 0,
        max: 100,
      },
      series: [{
        name: 'Analysis 1',
        data: [5, 15, 25, 35, 45]
      }, {
        name: 'Analysis 2',
        data: [15, 25, 35, 45, 55]
      }] as any
    } as Highcharts.Options);
  }

  // ... existing code

}
