import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SummaryComponent } from './summary/summary.component';

import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import { FilterComponent } from './filter/filter.component';
import { DashboardService } from '../dash_service/dashboard.service';
import { Subscription, take, interval, combineLatest, zip, distinctUntilChanged } from 'rxjs';
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

  isWideScreen = window.innerWidth > 998;
  isMobileScreen = window.innerWidth > 468;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isWideScreen = window.innerWidth > 998;
    this.isMobileScreen = window.innerWidth > 468;
  }

  selectedDuration!: string;
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
  kwh_diff:number=0;
  max_kva:number=0;
  max_kw:number=0;
  pf_diff:number=0;
  deviceOptions:any;
  intervalSubscription: Subscription | undefined;
  kvahArray: any[] = [];
  kvaArray: any[] = [];
  kwhArray: any[] = [];
  dateTimeArray: any[] = [];

  ngOnInit() {
    Highcharts.chart('KVAguage', this.KVAguage);
    Highcharts.chart('KWguage', this.KWguage);
    Highcharts.chart('KVRguage', this.KVRguage);
    Highcharts.chart('PFguage', this.PFguage);
    Highcharts.chart('Currentguage', this.Currentguage);
    Highcharts.chart('Voltageguage', this.Voltageguage);
    this.getUserDevices();
    this.startInterval();
    this.piedataRetrieve();
    this.retrievingValues();
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
          this.deviceOptions = devices.getFeederData;
          let id=sessionStorage.getItem('deviceID');
          let interval=sessionStorage.getItem('interval');
          if(id==null || id=='' ||id==undefined || interval==null){
            this.DashDataService.setDeviceId(this.deviceOptions[0].feederUid);
            this.DashDataService.setInterval('12hour');
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
    zip(this.DashDataService.deviceID$, this.DashDataService.interval$)
    .pipe(distinctUntilChanged())
    .subscribe(([deviceID, interval]) => {
      this.deviceUID = deviceID ?? '';
      this.interval = interval ?? '';

      this.barData();
      this.feederinterval();
      this.subscribeToTopics();
    });
  }

  piedataRetrieve(){
    const pieValue = sessionStorage.getItem('pieInterval');
    if(pieValue=='' || pieValue==null || pieValue==undefined){
      this.selectedDuration = '1hour';
      this.pieData();
    }else{
      this.selectedDuration = pieValue;
      this.pieData();
    }
  }

  onDurationChange(event: any) {
    this.selectedDuration = event.value;
    sessionStorage.setItem('pieInterval',this.selectedDuration);
    this.pieData();
  }

  pieData() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.pieDetails(this.CompanyId, this.selectedDuration).subscribe(
        (piedata) => {
          this.pieChartData.length = 0;
          Array.prototype.push.apply(this.pieChartData, piedata.map((entry: { device: any; data: { kvah_diff: any; }; }) => ({
            name: entry.device,
            y: entry.data.kvah_diff
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
          const new_data = bardata.data;
          this.kvahArray = new_data.map((entry: any) => [
            new Date(entry.bucket_date).getTime(),
            parseFloat(entry.kvah_difference)
          ]);
          this.kwhArray = new_data.map((entry: any) => [
            new Date(entry.bucket_date).getTime(),
            parseFloat(entry.kwh_difference)
          ]);          

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
              type: 'datetime',
            },
            yAxis: {
              title: {
                text: ''
              },
            },
            series: [{
              type: 'column',
              name: 'KVAH',
              data: this.kvahArray
            }, {
              type: 'column',
              name: 'KWH',
              data: this.kwhArray
            }
          ],
            exporting: {
              enabled: false
            }
          };
          
          Highcharts.chart('BarChart', BarChartOptions);
        },
        (error) =>{
          this.snackBar.open('Error while fetching bar data!', 'Dismiss', {
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
          console.log(data)
          this.kvah=data.fetchOverview.kvah_difference;
          this.kvarh_led=data.fetchOverview.kvarh_leading??0;
          this.kvarh_lag=data.fetchOverview.kvarh_lagging??0;
          this.kwh_diff=data.fetchOverview.kwh_difference;
          this.max_kva=data.fetchOverview.max_kva;
          this.max_kw=data.fetchOverview.max_kw;
          this.pf_diff=data.fetchOverview.pf_difference;
        },
        (error) => {
        }
      );
    }
  } 

  startInterval() {
    this.intervalSubscription = interval(50000)
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
