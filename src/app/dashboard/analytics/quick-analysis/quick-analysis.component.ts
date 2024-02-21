import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashboardService } from '../../dash_service/dashboard.service';
import { MatChipSelectionChange } from '@angular/material/chips';

HighchartsMore(Highcharts);

@Component({
  selector: 'app-quick-analysis',
  templateUrl: './quick-analysis.component.html',
  styleUrls: ['./quick-analysis.component.css']
})
export class QuickAnalysisComponent implements OnInit, AfterViewInit {

  selectedIntervals: string = '1hour';
  selectedDevice: string = '';
  selectedshift: string = 'ShiftA';

  @ViewChild('chart2', { static: false }) chart2Container!: ElementRef;
  data: any;

  Deviceid: string[] = [];
  kvaSeriesData: any[] = [];

  constructor(private service: DashboardService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  parametrisedGraph(): void {
    const seriesData: any[] = [];
  
    // Iterate over each device and create a series for it
    Object.keys(this.data).forEach((deviceId: string, index: number) => {
      const deviceData = this.data[deviceId];
  
      const series = {
        name: `Device ${index + 1} - ${deviceId}`,
        data: deviceData.kva.map((kva: any, kvaIndex: string | number) => [new Date(deviceData.timestamp[kvaIndex]).getTime(), kva]),
      };
  
      seriesData.push(series);
    });
  
    Highcharts.chart(this.chart2Container.nativeElement, {
      chart: {
        type: 'line',
        plotBorderWidth: 0,
      },
      title: {
        text: 'Parametrised Chart',
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
          text: 'Values',
        },
        min: 0,
        max: 50, // Adjust the max value as needed
        gridLineWidth: 0,
      },
      legend: {
        symbolRadius: 0,
        verticalAlign: 'top',
      },
      series: seriesData as any,
    });
  }
  

  onIntervalChange(event: any): void {
    // Log the selected interval value
    // console.log('Selected Interval:', this.selectedIntervals);
  }

  generateGraph(): void {
  }

  onParameterSelected(event: MatChipSelectionChange): void {
    if (event.source.selected) {
      const selectedParameter = event.source.value;
      console.log('Selected Parameter:', selectedParameter);
      // You can do further processing with the selected parameter here
    }
  }
}
