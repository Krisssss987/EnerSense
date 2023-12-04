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
    
    Highcharts.chart('KVAguage', this.KVAguage);
    Highcharts.chart('KWguage', this.KWguage);
    Highcharts.chart('KVRguage', this.KVRguage);
    Highcharts.chart('PFguage', this.PFguage);
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
 
  KVAguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
      height: '155vh',
      margin: [0, 20, 20, 20],
      backgroundColor: 'white',
      style: {
        border: 'none' // Remove stroke
      }
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      center: ['50%', '75%'],
      size: '90%',
      background: [{
        backgroundColor: 'white'
      }]
    },
    yAxis: {
      min: 0,
      tickPixelInterval: 72,
      tickPosition: 'inside',
      tickColor: 'white',
      tickLength: 20,
      tickWidth: 2,
      minorTickInterval: null,
      labels: {
        distance: 20,
        style: {
          fontSize: '14px'
        }
      },
      lineWidth: 0,
      plotBands: [{
        from: 0,
        to: 120,
        color: '#55BF3B', // green
        thickness: 20
      }, {
        from: 120,
        to: 160,
        color: '#DDDF0D', // yellow
        thickness: 20
      }, {
        from: 160,
        to: 50000000000000,
        color: '#DF5353', // red
        thickness: 20
      }]
    },
    series: [{
      type: 'gauge',
      name: '',
      data: [240],
      tooltip: {
        valueSuffix: 'm'
      },
      dataLabels: {
        format: '{y}  ',
        borderWidth: 0,
        color: (
          Highcharts.defaultOptions.title &&
          Highcharts.defaultOptions.title.style &&
          Highcharts.defaultOptions.title.style.color
        ) || '#333333',
        style: {
          fontSize: '16px'
        }
      },
      dial: {
        radius: '80%',
        backgroundColor: 'gray',
        baseWidth: 12,
        baseLength: '0%',
        rearLength: '0%'
      },
      pivot: {
        backgroundColor: 'gray',
        radius: 6
      }
    }],
  exporting: {
    enabled: false // Disable the options button
  }
  };

  KWguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
      height: '155vh',
      margin: [0, 20, 20, 20],
      backgroundColor: 'white',
      style: {
        border: 'none' // Remove stroke
      }
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      center: ['50%', '75%'],
      size: '90%',
      background: [{
        backgroundColor: 'white'
      }]
    },
    yAxis: {
      min: 0,
      tickPixelInterval: 72,
      tickPosition: 'inside',
      tickColor: 'white',
      tickLength: 20,
      tickWidth: 2,
      minorTickInterval: null,
      labels: {
        distance: 20,
        style: {
          fontSize: '14px'
        }
      },
      lineWidth: 0,
      plotBands: [{
        from: 0,
        to: 120,
        color: '#55BF3B', // green
        thickness: 20
      }, {
        from: 120,
        to: 160,
        color: '#DDDF0D', // yellow
        thickness: 20
      }, {
        from: 160,
        to: 50000000000000,
        color: '#DF5353', // red
        thickness: 20
      }]
    },
    series: [{
      type: 'gauge',
      name: '',
      data: [240],
      tooltip: {
        valueSuffix: 'm'
      },
      dataLabels: {
        format: '{y}  ',
        borderWidth: 0,
        color: (
          Highcharts.defaultOptions.title &&
          Highcharts.defaultOptions.title.style &&
          Highcharts.defaultOptions.title.style.color
        ) || '#333333',
        style: {
          fontSize: '16px'
        }
      },
      dial: {
        radius: '80%',
        backgroundColor: 'gray',
        baseWidth: 12,
        baseLength: '0%',
        rearLength: '0%'
      },
      pivot: {
        backgroundColor: 'gray',
        radius: 6
      }
    }],
  exporting: {
    enabled: false // Disable the options button
  }
  };

  KVRguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
      height: '155vh',
      margin: [0, 20, 20, 20],
      backgroundColor: 'white',
      style: {
        border: 'none' // Remove stroke
      }
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      center: ['50%', '75%'],
      size: '90%',
      background: [{
        backgroundColor: 'white'
      }]
    },
    yAxis: {
      min: 0,
      tickPixelInterval: 72,
      tickPosition: 'inside',
      tickColor: 'white',
      tickLength: 20,
      tickWidth: 2,
      minorTickInterval: null,
      labels: {
        distance: 20,
        style: {
          fontSize: '14px'
        }
      },
      lineWidth: 0,
      plotBands: [{
        from: 0,
        to: 120,
        color: '#55BF3B', // green
        thickness: 20
      }, {
        from: 120,
        to: 160,
        color: '#DDDF0D', // yellow
        thickness: 20
      }, {
        from: 160,
        to: 50000000000000,
        color: '#DF5353', // red
        thickness: 20
      }]
    },
    series: [{
      type: 'gauge',
      name: '',
      data: [240],
      tooltip: {
        valueSuffix: 'm'
      },
      dataLabels: {
        format: '{y}  ',
        borderWidth: 0,
        color: (
          Highcharts.defaultOptions.title &&
          Highcharts.defaultOptions.title.style &&
          Highcharts.defaultOptions.title.style.color
        ) || '#333333',
        style: {
          fontSize: '16px'
        }
      },
      dial: {
        radius: '80%',
        backgroundColor: 'gray',
        baseWidth: 12,
        baseLength: '0%',
        rearLength: '0%'
      },
      pivot: {
        backgroundColor: 'gray',
        radius: 6
      }
    }],
  exporting: {
    enabled: false // Disable the options button
  }
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
  PFguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
      height: '155vh',
      margin: [0, 20, 20, 20],
      backgroundColor: 'white',
      style: {
        border: 'none' // Remove stroke
      }
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      center: ['50%', '75%'],
      size: '90%',
      background: [{
        backgroundColor: 'white'
      }]
    },
    yAxis: {
      min: 0,
      tickPixelInterval: 72,
      tickPosition: 'inside',
      tickColor: 'white',
      tickLength: 20,
      tickWidth: 2,
      minorTickInterval: null,
      labels: {
        distance: 20,
        style: {
          fontSize: '14px'
        }
      },
      lineWidth: 0,
      plotBands: [{
        from: 0,
        to: 120,
        color: '#55BF3B', // green
        thickness: 20
      }, {
        from: 120,
        to: 160,
        color: '#DDDF0D', // yellow
        thickness: 20
      }, {
        from: 160,
        to: 50000000000000,
        color: '#DF5353', // red
        thickness: 20
      }]
    },
    series: [{
      type: 'gauge',
      name: '',
      data: [240],
      tooltip: {
        valueSuffix: 'm'
      },
      dataLabels: {
        format: '{y}  ',
        borderWidth: 0,
        color: (
          Highcharts.defaultOptions.title &&
          Highcharts.defaultOptions.title.style &&
          Highcharts.defaultOptions.title.style.color
        ) || '#333333',
        style: {
          fontSize: '16px'
        }
      },
      dial: {
        radius: '80%',
        backgroundColor: 'gray',
        baseWidth: 12,
        baseLength: '0%',
        rearLength: '0%'
      },
      pivot: {
        backgroundColor: 'gray',
        radius: 6
      }
    }],
  exporting: {
    enabled: false // Disable the options button
  }
  };

  

  openSummary(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '800px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(SummaryComponent, dialogConfig);
  }
}