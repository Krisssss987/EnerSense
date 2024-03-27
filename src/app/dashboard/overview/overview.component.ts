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
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/authentication/auth/auth.service';

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
  kvah_rupees:number=10;
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
            this.retrievingValues();
          } else {
            this.retrievingValues();
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
    .subscribe(([deviceID, interval]) => {
      this.deviceUID = deviceID ?? '';
      this.interval = interval ?? '';
      this.functionsToCall();      
    });
  }

  functionsToCall(){
    this.barData();
    this.feederinterval();
    this.subscribeToTopics();
    this.lastEntry();
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
          Array.prototype.push.apply(this.pieChartData, piedata.data.map((entry: { device_uid: any; kwh_difference: any; }) => ({
            name: entry.device_uid,
            y: parseFloat(entry.kwh_difference)
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
      const subscription = this.DashDataService.barDetails(this.deviceUID, this.interval).subscribe(
        (bardata) => {
          const new_data = bardata.data;
          const offsetMinutes = 5 * 60 + 30;

          this.kvahArray = new_data.map((entry: any) => [
            new Date(entry.bucket_date).getTime() + offsetMinutes * 60 * 1000,
            parseFloat(entry.kvah_difference)
          ]);
          this.kwhArray = new_data.map((entry: any) => [
            new Date(entry.bucket_date).getTime() + offsetMinutes * 60 * 1000,
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
      
      this.mqttSubscriptions.push(subscription)
    }
  } 

  feederinterval() {
    if (this.CompanyId) {
      const subscription = this.DashDataService.feederinterval(this.deviceUID, this.interval).subscribe(
        (data) => {
          if(data.fetchOverview){
          this.kvah=data.fetchOverview.kvah_diff_interval_1??0;
          this.kvarh_led=data.fetchOverview.kvarh_1_lead??0;
          this.kvarh_lag=data.fetchOverview.kvarh_1_lag??0;
          this.kwh_diff=data.fetchOverview.kwh_diff_interval_1??0;
          this.max_kva=data.fetchOverview.kva_max_interval_1??0;
          this.max_kw=data.fetchOverview.kw_max_interval_1??0;
          this.pf_diff=data.fetchOverview.pf_interval_1??0;
          this.CO2=parseFloat((data.fetchOverview.kwh_diff_interval_1 * 0.82).toFixed(0))??0;
          }else{
            this.kvah=0;
            this.kvarh_led=0;
            this.kvarh_lag=0;
            this.kwh_diff=0;
            this.max_kva=0;
            this.max_kw=0;
            this.pf_diff=0;
            this.CO2=0
          }
        },
        (error) => {
        }
      );
      this.mqttSubscriptions.push(subscription)
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
    this.stopInterval();
    this.unsubscribeFromTopics();
    Highcharts.chart('KVAguage', this.KVAguage).destroy();
    Highcharts.chart('KWguage', this.KWguage).destroy();
    Highcharts.chart('KVRguage', this.KVRguage).destroy();
    Highcharts.chart('PFguage', this.PFguage).destroy();
    Highcharts.chart('Currentguage', this.Currentguage).destroy();
    Highcharts.chart('Voltageguage', this.Voltageguage).destroy();
    Highcharts.chart('PieChart', this.PieChart).destroy();
  }
  
  guageChange(){
    const kvachart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'KVAguage');

    kvachart?.series[0].update({ 
      type: 'gauge',
      data: [this.kva]
    });

    kvachart?.yAxis[0].update({
      max: this.kva < 200 ? 200 : undefined
    });
    
    kvachart?.redraw();

    const kwchart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'KWguage');

    kwchart?.series[0].update({ 
      type: 'gauge',
      data: [this.kw]
    });

    kwchart?.yAxis[0].update({
      max: this.kw < 200 ? 200 : undefined
    });

    const kvrchart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'KVRguage');

    kvrchart?.series[0].update({ 
      type: 'gauge',
      data: [this.kvr]
    });

    if(this.kvr > 200){
      kvrchart?.yAxis[0].update({
        max: this.kvr < 200 ? 200 : undefined
      })
    }

    const pfchart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'PFguage');

    pfchart?.series[0].update({ 
      type: 'gauge',
      data: [this.pf]
    });

    pfchart?.yAxis[0].update({
      max: this.pf < 1 ? 1 : undefined
    });

    const currentchart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'Currentguage');

    currentchart?.series[0].update({ 
      type: 'gauge',
      data: [this.current]
    });

    currentchart?.yAxis[0].update({
      max: this.current < 200 ? 200 : undefined
    });


    const voltagechart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'Voltageguage');

    voltagechart?.series[0].update({ 
      type: 'gauge',
      data: [this.voltage]
    });

    voltagechart?.yAxis[0].update({
      max: this.voltage < 200 ? 200 : undefined
    });
  }

  subscribeToTopics() {
    const dataTopic = `Energy/Sense/Live/${this.deviceUID}/7`;

    const dataSubscription = this.mqttService.observe(dataTopic).subscribe((dataMessage: IMqttMessage) => {
      const dataPayload = JSON.parse(dataMessage.payload.toString());

      this.kw=parseFloat(dataPayload.kw);
      this.kvr=parseFloat(dataPayload.kvar);
      this.pf=parseFloat(dataPayload.pf);

    this.guageChange();
    }); 
    this.mqttSubscriptions.push(dataSubscription);
    
    const kvaTopic = `Energy/Sense/Live/${this.deviceUID}/8`;

    const kvaSubscription = this.mqttService.observe(kvaTopic).subscribe((dataMessage: IMqttMessage) => {
      const dataPayload = JSON.parse(dataMessage.payload.toString());
      this.kva=parseFloat(dataPayload.kva);

    this.guageChange();
    }); 
    this.mqttSubscriptions.push(kvaSubscription);

    const voltageTopic = `Energy/Sense/Live/${this.deviceUID}/1`;

    const voltageSubscription = this.mqttService.observe(voltageTopic).subscribe((dataMessage: IMqttMessage) => {
      const dataPayload = JSON.parse(dataMessage.payload.toString());
      this.voltage=parseFloat(dataPayload.V_N);

    this.guageChange();
    }); 
    this.mqttSubscriptions.push(voltageSubscription);
    
    const currentTopic = `Energy/Sense/Live/${this.deviceUID}/3`;

    const currentSubscription = this.mqttService.observe(currentTopic).subscribe((dataMessage: IMqttMessage) => {
      const dataPayload = JSON.parse(dataMessage.payload.toString());
      this.current=parseFloat(dataPayload.I);

    this.guageChange();
    }); 
    this.mqttSubscriptions.push(currentSubscription);
  }

  lastEntry() {
    if (this.CompanyId) {
      const subscription = this.DashDataService.fetchLatestEntry(this.deviceUID).subscribe(
        (data) => {
          const newData = data.data[0];
          
          this.kw=0;
          this.kvr=0;
          this.pf=0;
          this.kva=0;
          this.voltage=0;
          this.current=0;
          
          this.kw=parseFloat(newData.kw);
          this.kvr=parseFloat(newData.kvar);
          this.pf=parseFloat(newData.pf);
          this.kva=parseFloat(newData.kva);
          this.voltage=parseFloat(newData.voltage_n);
          this.current=parseFloat(newData.current);

          this.guageChange();
        },
        (error) =>{
          this.snackBar.open('Error while fetching bar data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
      this.mqttSubscriptions.push(subscription)
    }
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
      }
    },
    series: [{
      type: 'pie',
      name: 'KWH',
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
      size: '90%',
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
      size: '90%',
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
      size: '90%',
      background: [{
        backgroundColor: 'white'
      }]
    },
    yAxis: {
      min:-200,
      max:200,
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
        from: -1000,
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
      size: '90%',
      background: [{
        backgroundColor: 'white'
      }]
    },
    yAxis: {
      min: 0,
      max:this.pf < 1 ? 1 : undefined,
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
      size: '90%',
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
      size: '90%',
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
