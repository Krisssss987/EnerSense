import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SummaryComponent } from './summary/summary.component';

import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import { FilterComponent } from './filter/filter.component';
import { DashboardService } from '../dash_service/dashboard.service';
import { Subscription, take, interval } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { AuthService } from 'src/app/login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent  implements OnInit {

  firstname=sessionStorage.getItem('firstname')
  lastname=sessionStorage.getItem('lastname')
  mqttSubscriptions: Subscription[] = [];
  deviceUID!:string;
  devices!: any[];
  deviceData: any[] = [];
  kva:number=0;
  kw:number=0;
  kvr:number=0;
  current:number=0;
  voltage:number=0;
  pf:number=0;
  datapayload:any;
  CompanyId!:string | null;
  interval!:string;
  pieChartData: PieChartData[] = [];
  kvah:number=0;
  kval_rupees:number=10;
  kwh:number=0;
  kvarh_led:number=0;
  kvarh_lag:number=0;
  CO2:number=0;
  deviceOptions:any;
  intervalSubscription: Subscription | undefined;
  kvahArray= [];
  kvaArray= [];
  kwhArray= [];
  dateTimeArray= [];

  ngOnInit() {
    Highcharts.chart('KVAguage', this.KVAguage);
    Highcharts.chart('KWguage', this.KWguage);
    Highcharts.chart('KVRguage', this.KVRguage);
    Highcharts.chart('PFguage', this.PFguage);
    Highcharts.chart('Currentguage', this.Currentguage);
    Highcharts.chart('Voltageguage', this.Voltageguage);
    this.retrievingValues();
    this.getUserDevices();
    this.startInterval();
  }

  constructor(
    private mqttService: MqttService,
    public dialog: MatDialog,
    public DashDataService: DashboardService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe
  ){}

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.deviceOptions = devices;
          let id=sessionStorage.getItem('deviceID');
          let interval=sessionStorage.getItem('interval');
          if(id==null || interval==null){
            this.DashDataService.setDeviceId(this.deviceOptions[0].deviceid);
            this.DashDataService.setInterval('1hour');
          }else{
            
          }
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  retrievingValues(){
    this.DashDataService.deviceID$.subscribe((deviceID) => {
      this.deviceUID=deviceID??'';
      this.subscribeToTopics();
    });
    this.DashDataService.interval$.subscribe((interval) => {
      this.interval=interval??'';
      this.pieData();
      this.barData();
      this.feederinterval();
    });
    this.DashDataService.StartDate$.subscribe((StartDate) => {
      console.log(StartDate);
    });
    this.DashDataService.EndDate$.subscribe((EndDate) => {
      console.log(EndDate);
    });
  }

  pieData() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.pieDetails(this.CompanyId, this.interval).subscribe(
        (piedata) => {
          this.pieChartData.length = 0;
          Array.prototype.push.apply(this.pieChartData, piedata.map((entry: { device: any; data: { kvah: any; }; }) => ({
            name: entry.device,
            y: entry.data.kvah
          })));
  
          Highcharts.chart('PieChart', this.PieChart);
        },
        (error) => {
          this.snackBar.open('Error while fetching Pie Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  } 

  barData() {
    if (this.CompanyId) {
      this.DashDataService.barDetails(this.deviceUID, this.interval).subscribe(
        (bardata) => {
          const new_data = bardata[this.deviceUID].aggregatedValues;
          this.kvahArray = new_data.map((item: { kvah: any; }) => item.kvah);
          this.kvaArray = new_data.map((item: { kva: any; }) => item.kva);
          this.kwhArray = new_data.map((item: { kwh: any; }) => item.kwh);
          this.dateTimeArray = new_data.map((item: { date_time: any }) => {
            return this.datePipe.transform(item.date_time, 'dd-MM-yyyy HH:mm:ss') || '';
          });      

          const BarChartOptions: Highcharts.Options = {
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
              categories: this.dateTimeArray,
              startOnTick: true,
              endOnTick: false,
              tickmarkPlacement: 'between',
              minPadding: 0,
              maxPadding: 0,
              min: 0,
              max: undefined,
              labels: {
                step: 1,
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
                  text: 'Max Demand',
                  align: 'right',
                  x: -20
                }
              }]
            },
            series: [{
              type: 'column',
              name: 'KVAH',
              data: this.kvahArray
            }, {
              type: 'column',
              name: 'KWH',
              data: this.kwhArray
            }, {
              type: 'spline',
              name: 'KVA',
              data: this.kvaArray
            }]
          };
          
          Highcharts.chart('BarChart', BarChartOptions);
        },
        (error) => {
          this.snackBar.open('Error while fetching Bar Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  } 

  feederinterval() {
    if (this.CompanyId) {
      this.DashDataService.feederinterval(this.deviceUID, this.interval).subscribe(
        (data) => {
          this.kvah=data.kvah;
          this.kwh=data.kwh;
          this.kvarh_led=data.kvarh;
        },
        (error) => {
        }
      );
    }
  } 

  startInterval() {
    this.intervalSubscription = interval(5000)
      .pipe(take(Infinity))
      .subscribe(() => {
        this.feederinterval();
      });
  }

  stopInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  unsubscribeFromTopics() {
    this.mqttSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.mqttSubscriptions = [];
  }

  ngOnDestroy() {
    this.unsubscribeFromTopics();
  }

  subscribeToTopics() {
    this.deviceData = [];

      const dataTopic = `ems_live/${this.deviceUID}`;
  
      const dataSubscription = this.mqttService.observe(dataTopic).subscribe((dataMessage: IMqttMessage) => {
        const dataPayload = JSON.parse(dataMessage.payload.toString());

        Object.keys(dataPayload).forEach(key => {
          if (typeof dataPayload[key] === 'number' && dataPayload[key] < 0) {
              dataPayload[key] = Math.abs(dataPayload[key]);
          }
        });

        console.log(dataPayload)
        this.kva=dataPayload.kva;
        this.kw=dataPayload.kw;
        this.kvr=dataPayload.kvar;
        this.voltage=dataPayload.voltage_n;
        this.current=dataPayload.current;
        this.pf=dataPayload.pf;

        const kvachart = Highcharts.charts[0]; // Assuming the gauge chart is the first chart on the page

        kvachart?.series[0].update({ 
          type: 'gauge',
          data: [this.kva]
        });

        kvachart?.yAxis[0].update({
          max: this.kva < 200 ? 200 : undefined
        });

        const kwchart = Highcharts.charts[1]; // Assuming the gauge chart is the first chart on the page

        kwchart?.series[0].update({ 
          type: 'gauge',
          data: [this.kw]
        });

        kwchart?.yAxis[0].update({
          max: this.kw < 200 ? 200 : undefined
        });

        const kvrchart = Highcharts.charts[2]; // Assuming the gauge chart is the first chart on the page

        kvrchart?.series[0].update({ 
          type: 'gauge',
          data: [this.kvr]
        });

        kvrchart?.yAxis[0].update({
          max: this.kvr < 200 ? 200 : undefined
        });

        const pfchart = Highcharts.charts[3]; // Assuming the gauge chart is the first chart on the page

        pfchart?.series[0].update({ 
          type: 'gauge',
          data: [this.pf]
        });

        pfchart?.yAxis[0].update({
          max: this.pf < 2 ? 2 : undefined
        });

        const currentchart = Highcharts.charts[4]; // Assuming the gauge chart is the first chart on the page

        currentchart?.series[0].update({ 
          type: 'gauge',
          data: [this.current]
        });

        currentchart?.yAxis[0].update({
          max: this.current < 200 ? 200 : undefined
        });
  
      this.mqttSubscriptions.push(dataSubscription);

        const voltagechart = Highcharts.charts[5]; // Assuming the gauge chart is the first chart on the page

        voltagechart?.series[0].update({ 
          type: 'gauge',
          data: [this.voltage]
        });

        voltagechart?.yAxis[0].update({
          max: this.voltage < 200 ? 200 : undefined
        });
      });      
  }

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
      data: this.pieChartData
    }],
    exporting: {
      enabled: false // Disable the options button
    }
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
      max:this.kva < 200 ? 200 : undefined,
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
      data: [this.kva],
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
      max:this.kw < 200 ? 200 : undefined,
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
      data: [this.kw],
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
      max:this.kvr < 200 ? 200 : undefined,
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
      data: [this.kvr],
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
      max:this.pf < 2 ? 2 : undefined,
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
        to: 0.75,
        color: '#55BF3B', // green
        thickness: 20
      }, {
        from: 0.75,
        to: 1,
        color: '#DDDF0D', // yellow
        thickness: 20
      }, {
        from: 1,
        to: 50000000000000,
        color: '#DF5353', // red
        thickness: 20
      }]
    },
    series: [{
      type: 'gauge',
      name: '',
      data: [this.pf],
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
      max:this.current < 200 ? 200 : undefined,
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
      data: [this.current],
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
      max:this.voltage < 200 ? 200 : undefined,
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
      data: [this.voltage],
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

  openFilterDailog(): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';

    const dialogRef = this.dialog.open(FilterComponent, dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

interface PieChartData {
  name: string;
  y: number;
}
