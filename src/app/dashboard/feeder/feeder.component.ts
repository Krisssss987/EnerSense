import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SummaryComponent } from '../overview/summary/summary.component';
import * as Highcharts from 'highcharts';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import { DashboardService } from '../dash_service/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feeder',
  templateUrl: './feeder.component.html',
  styleUrls: ['./feeder.component.css']
})
export class FeederComponent {

  selectedFeed:string='feeder';
  CompanyEmail!: string | null;
  selectedDevice!: string;
  selectedGroup!: string;
  selectedFeederInterval: string ='';
  selectedGroupInterval: string ='';
  selectedVirtualGroupInterval: string ='';
  deviceOptions: any[] = [];
  groupOptions: any[] = [];
  CompanyId!: string | null;
  feederStartDate = new FormControl('', [Validators.required]);
  feederEndDate = new FormControl('', [Validators.required]);
  groupStartDate = new FormControl('', [Validators.required]);
  groupEndDate = new FormControl('', [Validators.required]);
  virtualStartDate = new FormControl('', [Validators.required]);
  virtualEndDate = new FormControl('', [Validators.required]);
  dataPayload:any;

  ngOnInit(): void {
    this.getUserDevices();
    this.getgroupDevices();
    this.lastEntry();
  }

  ngAfterViewInit() {
    Highcharts.chart('chartContainer', this.chartOptions);    
    Highcharts.chart('KVAYguage', this.KVAguage);
    Highcharts.chart('KWYguage', this.KWguage);
    Highcharts.chart('KVRYguage', this.KVRguage);
    Highcharts.chart('PFYguage', this.PFguage);
  }

  constructor(
    private authService: AuthService,
    private service: DashboardService,
    public snackBar: MatSnackBar,
  ){}

  lastEntry() {
    if (this.CompanyId) {
      this.service.fetchLatestEntry(this.selectedDevice).subscribe(
        (data) => {
          const newData = data.data[0];
          this.dataPayload = Object.fromEntries(
            Object.entries(newData).map(([key, value]) => [key, +String(value)])
          );
          console.log(this.dataPayload);
        },
        (error) =>{
          this.snackBar.open('Error while fetching bar data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  } 
  
  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.service.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.deviceOptions = devices.getFeederData;
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getgroupDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.service.groupDetails(this.CompanyId).subscribe(
        (group: any) => {
          this.groupOptions = group.getFeederGroupData;
        },
        (error) => {
          this.snackBar.open('Error while fetching devices Groups!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  currentoperations() {
    if (this.selectedDevice) {
      this.service.currentoperations(this.selectedDevice).subscribe(
        (data: any) => {
          console.log(data);
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  voltageoperations() {
    if (this.selectedDevice) {
      this.service.voltageoperations(this.selectedDevice).subscribe(
        (data: any) => {
          console.log(data);
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  phasevolt() {
    if (this.selectedDevice) {
      this.service.phasevolt(this.selectedDevice).subscribe(
        (data: any) => {
          console.log(data);
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  updateData(){
    if(this.selectedDevice && this.selectedFeederInterval){
      this.currentoperations();
      this.phasevolt();
      this.voltageoperations();
    }
  }
 
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
      pointPlacement: 0
    }],
  };

    KVAguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
      height: '160vh',
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
      height: '160vh',
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
      height: '160vh',
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
  PFguage: Highcharts.Options = {
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
      height: '160vh',
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
}