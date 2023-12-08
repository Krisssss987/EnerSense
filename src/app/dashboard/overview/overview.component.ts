import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SummaryComponent } from './summary/summary.component';

import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent  implements OnInit {

  ngOnInit() {
    Highcharts.chart('KVAguage', this.KVAguage);
    Highcharts.chart('KWguage', this.KWguage);
    Highcharts.chart('KVRguage', this.KVRguage);
    Highcharts.chart('PFguage', this.PFguage);
    Highcharts.chart('Currentguage', this.Currentguage);
    Highcharts.chart('Voltageguage', this.Voltageguage);
    
    Highcharts.chart('PieChart', this.PieChart);
    Highcharts.chart('BarChart', this.BarChart);
  }

  constructor(
    public dialog: MatDialog,
  ){}

  BarChart: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: ['Category 1', 'Category 2', 'Category 3'],
      startOnTick: true,
      endOnTick: false,
      tickmarkPlacement: 'between',
      minPadding: 0,
      maxPadding: 0,
      min: 0,
      max: undefined,
      labels: {
        step: 0.5,
        enabled:false
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      plotLines: [{
        color: 'black',
        width: 2,
        value: 130000,
        label: {
          text: 'Max Inflation',
          align: 'right',
          x: -20
        }
      }]
    },
    series: [{
      type: 'column',
      name: 'KVAH',
      data: [50000, 100000, 100005]
    }, {
      type: 'column',
      name: 'KWH',
      data: [51086, 136000, 5500, 141000]
    }, {
      type: 'spline',
      name: 'Line Series',
      data: [10000, 20000, 30000,50000,60000, 200000]
    }]
  };

  PieChart: Highcharts.Options = {
    chart: {
      type: 'pie'
    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true
        },
        // colors: [{
        //   radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
        //   stops: [
        //     [0, 'rgba(255, 0, 0, 0.5)'],
        //     [1, 'rgba(255, 0, 0, 1)']
        //   ]
        // }, {
        //   radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
        //   stops: [
        //     [0, 'rgba(0, 255, 0, 0.5)'],
        //     [1, 'rgba(0, 255, 0, 1)']
        //   ]
        // }, {
        //   radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
        //   stops: [
        //     [0, 'rgba(0, 0, 255, 0.5)'],
        //     [1, 'rgba(0, 0, 255, 1)']
        //   ]
        // }]
      }
    },
    series: [{
      type: 'pie',
      name: 'Data',
      data: [
        { name: 'Red', y: 320 },
        { name: 'Green', y: 50 },
        { name: 'Blue', y: 20 }
      ]
    }]
  };

  KVAguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
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
      size: '110%',
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
      size: '110%',
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
      size: '110%',
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

  PFguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
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
      size: '110%',
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

  Currentguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
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
      size: '110%',
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

  Voltageguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
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
      size: '110%',
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
    dialogRef.afterClosed().subscribe(userAdded => {});
  }
}
