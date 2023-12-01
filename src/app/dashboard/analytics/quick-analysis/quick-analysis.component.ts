import { Component, AfterContentInit, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

@Component({
  selector: 'app-quick-analysis',
  templateUrl: './quick-analysis.component.html',
  styleUrls: ['./quick-analysis.component.css']
})
export class QuickAnalysisComponent implements OnInit,AfterViewInit{

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

  @ViewChild('chart4', { static: false }) chart4Container!: ElementRef;

  // ... existing code

  ngAfterViewInit() {

    this.quickAnalysis(this.chart4Container.nativeElement);
  }


  quickAnalysis(container: HTMLElement) {
    Highcharts.chart(container, {
      chart: {
        type: 'spline'
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

}
