import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SummaryComponent } from '../overview/summary/summary.component';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-feeder',
  templateUrl: './feeder.component.html',
  styleUrls: ['./feeder.component.css']
})
export class FeederComponent {
  ngAfterViewInit() {
    Highcharts.chart('chartContainer', this.chartOptions);
    Highcharts.chart('pieContainer', this.pieChart);
    Highcharts.chart('lineContainer', this.lineChart);
  }

  constructor(
    public dialog: MatDialog,
  ){}

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'line'
    },
    title: {
      text: ' '
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: [
        'Main PCC',
        'HT Meter (S/Sn-4)',
        'LT Meter (COB)',
        'LT HILTOP INCOMER'
      ]
    },
    yAxis: [{
      min: 0,
      title: {
        text: ''
      }
    }, {
      title: {
        text: ''
      },
      opposite: true
    }],
    legend: {
      shadow: false
    },
    tooltip: {
      shared: true
    },
    plotOptions: {
      column: {
        grouping: false,
        shadow: false,
        borderWidth: 0
      }
    },
    series: [{
      type:'column',
      name: 'Max Demand KVA',
      color: 'rgba(165,170,217,1)',
      data: [140, 90, 90, 90],
      pointPadding: 0.1,
      pointPlacement: 0
    }, {
      type:'column',
      name: 'Live Demand KVA',
      color: 'rgba(126,86,134,.9)',
      data: [150, 73, 20, 54],
      pointPadding: 0.25,
      pointPlacement: 0
    }],
  };
  lineChart: Highcharts.Options = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'fgfgg'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: [
        'Main PCC',
        'HT Meter (S/Sn-4)',
        'LT Meter (COB)',
        'LT HILTOP INCOMER'
      ]
    },
    yAxis: [{
      min: 0,
      title: {
        text: ''
      }
    }, {
      title: {
        text: ''
      },
      opposite: true
    }],
    legend: {
      shadow: false
    },
    tooltip: {
      shared: true
    },
    series: [{
      name: 'Max Demand KVA',
      color: 'rgba(165,170,217,1)',
      data: [140, 90, 90, 90],
      type: 'line'  // Specify the type of series as 'line'
    }, {
      name: 'Live Demand KVA',
      color: 'rgba(126,86,134,.9)',
      data: [150, 73, 20, 54],
      type: 'line'  // Specify the type of series as 'line'
    }],
  };
  
  pieChart:Highcharts.Options={
    chart: {
      type: 'pie'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    tooltip: {
      valueSuffix: '%'
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f}%',
          style: {
            fontSize: '1.2em',
            textOutline: 'none',
            opacity: 0.7
          },
          filter: {
            operator: '>',
            property: 'percentage',
            value: 10
          }
        }
      }
    },
    series: [{
      type:'pie',
      name: 'Percentage',
      data: [{
        name: 'Water',
        y: 55.02
      }, {
        name: 'Fat',
        y: 26.71
      }, {
        name: 'Carbohydrates',
        y: 1.09
      }, {
        name: 'Protein',
        y: 15.5
      }, {
        name: 'Ash',
        y: 1.68
      }]
    }]
  };
  

  openSummary(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '800px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(SummaryComponent, dialogConfig);
  }
}