import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SummaryComponent } from '../overview/summary/summary.component';
import * as Highcharts from 'highcharts';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/auth/auth.service';
import { DashboardService } from '../dash_service/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AddAlertComponent } from '../tools/tools-component/add-alert/add-alert.component';

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
  selectedMultipleDevices:any;
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
  datePipe = new DatePipe('en-IN');
  dataPayload:any;
  alertData:any;
  instantPercent:any;
  instantData:any;
  activeKWH:string='0';
  todayKWH:string='0';
  yesterdayKWH:string='0';
  monthKWH:string='0';
  KVAH:string='0';
  KVARH:string='0';
  initialDevice!:string;
  whatToDo:string='feeder';

  ngOnInit(): void {   
    Highcharts.chart('KVAYguage', this.KVAYguage);
    Highcharts.chart('KWYguage', this.KWYguage);
    Highcharts.chart('KVRYguage', this.KVRYguage);
    Highcharts.chart('PFYguage', this.PFYguage);
    this.getUserDevices();
    this.getgroupDevices();
  }

  constructor(
    private authService: AuthService,
    private service: DashboardService,
    public snackBar: MatSnackBar,
    public dialog:MatDialog
  ){}

  
  openAlertDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddAlertComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(alertAdded => {
      setTimeout(() => {
      }, 1000);
    });
  }
  
  showingData(){
    const device = sessionStorage.getItem('FeederDevice');
    const interval = sessionStorage.getItem('FeederInterval');
    const feed = sessionStorage.getItem('FeederFeed');
    const start = sessionStorage.getItem('FeederStartDate');
    const end = sessionStorage.getItem('FeederEndDate');

    if(feed=='feeder'){
      if(interval == 'custom'){
        this.selectedFeederInterval=interval!; 
        this.selectedDevice=device!;
        this.selectedFeed=feed!;
        this.feederStartDate = new FormControl(start, [Validators.required]);
        this.feederEndDate = new FormControl(end, [Validators.required]);  
        this.whatToDo = 'feeder'; 
      }else{
        this.selectedFeederInterval=interval!; 
        this.selectedDevice=device!;
        this.selectedFeed=feed!; 
        this.whatToDo = 'feeder'; 
      }
    }else if(feed=='vgroup'){
      const multiDevice = device!.split(',');  
      if(interval == 'custom'){
        this.selectedVirtualGroupInterval=interval!; 
        this.selectedMultipleDevices=multiDevice!;
        this.selectedFeed=feed!;
        this.virtualStartDate = new FormControl(start, [Validators.required]);
        this.virtualEndDate = new FormControl(end, [Validators.required]);  
        this.whatToDo = 'vgroup';   
      }else{
        this.selectedVirtualGroupInterval=interval!; 
        this.selectedMultipleDevices=multiDevice!;
        this.selectedFeed=feed!; 
        this.whatToDo = 'vgroup'; 
      }
    }
  }

  previousData(){
    const device = sessionStorage.getItem('FeederDevice');
    const interval = sessionStorage.getItem('FeederInterval');
    const feed = sessionStorage.getItem('FeederFeed');

    if(feed=='feeder'){     
      this.whatToDo = 'feeder';  
      if(interval == 'custom' && device!=null && device!=undefined){
        const start = sessionStorage.getItem('FeederStartDate');
        const end = sessionStorage.getItem('FeederEndDate');

        if(start && end){
          this.currentoperations(device);
          this.getAlertsByFeederId(device);
          this.feederGetDemandBarGraphByDate(device,start,end);
          this.feederGetKWHByDate(device,start,end);
          this.feederGetKVAHByDate(device,start,end);
          this.feederGetKVARHByDate(device,start,end);
          this.getTodayKWHForFeeders(device);
          this.getYesterdayKWHForFeeders(device);
          this.getThisMonthKWHForFeeders(device);
          this.getPowerParamtersFeeders(device);
        }
        else{
          sessionStorage.setItem('FeederDevice', device);
          sessionStorage.setItem('FeederInterval', '12hour');
    
          this.currentoperations(device);
          this.getAlertsByFeederId(device);
          this.feederGetDemandBarGraphByInterval(device,'12hour');
          this.feederGetKWHByInterval(device,'12hour');
          this.feederGetKVAHByInterval(device,'12hour');
          this.feederGetKVARHByInterval(device,'12hour');
          this.getTodayKWHForFeeders(device);
          this.getYesterdayKWHForFeeders(device);
          this.getThisMonthKWHForFeeders(device);
          this.getPowerParamtersFeeders(device);
        }
      }
      else if(device && device!=null && device!=undefined && interval!=null && interval!=undefined && interval!='custom'){
        this.currentoperations(device);
        this.getAlertsByFeederId(device);
        this.feederGetDemandBarGraphByInterval(device,interval);
        this.feederGetKWHByInterval(device,interval);
        this.feederGetKVAHByInterval(device,interval);
        this.feederGetKVARHByInterval(device,interval);
        this.getTodayKWHForFeeders(device);
        this.getYesterdayKWHForFeeders(device);
        this.getThisMonthKWHForFeeders(device);
        this.getPowerParamtersFeeders(device);
      }
    }else if(feed=='vgroup'){ 
      this.whatToDo = 'vgroup'; 
      const multiDevice = device!.split(',');  

      if(interval == 'custom' && device!=null && device!=undefined){
        const start = sessionStorage.getItem('FeederStartDate');
        const end = sessionStorage.getItem('FeederEndDate');

        if(start && end){
          this.getAlertsByFeederId(multiDevice);
          this.feederGetDemandBarGraphByDate(multiDevice,start,end);
          this.feederGetKWHByDate(multiDevice,start,end);
          this.feederGetKVAHByDate(multiDevice,start,end);
          this.feederGetKVARHByDate(multiDevice,start,end);
          this.getTodayKWHForFeeders(multiDevice);
          this.getYesterdayKWHForFeeders(multiDevice);
          this.getThisMonthKWHForFeeders(multiDevice);
          this.getPowerParamtersFeeders(multiDevice);
        }
        else{
          sessionStorage.setItem('FeederDevice', device);
          sessionStorage.setItem('FeederInterval', '12hour');
    
          this.getAlertsByFeederId(multiDevice);
          this.feederGetDemandBarGraphByInterval(multiDevice,'12hour');
          this.feederGetKWHByInterval(multiDevice,'12hour');
          this.feederGetKVAHByInterval(multiDevice,'12hour');
          this.feederGetKVARHByInterval(multiDevice,'12hour');
          this.getTodayKWHForFeeders(multiDevice);
          this.getYesterdayKWHForFeeders(multiDevice);
          this.getThisMonthKWHForFeeders(multiDevice);
          this.getPowerParamtersFeeders(multiDevice);
        }
      }
      else if(device && device!=null && device!=undefined && interval!=null && interval!=undefined && interval!='custom'){
        this.getAlertsByFeederId(multiDevice);
        this.feederGetDemandBarGraphByInterval(multiDevice,interval);
        this.feederGetKWHByInterval(multiDevice,interval);
        this.feederGetKVAHByInterval(multiDevice,interval);
        this.feederGetKVARHByInterval(multiDevice,interval);
        this.getTodayKWHForFeeders(multiDevice);
        this.getYesterdayKWHForFeeders(multiDevice);
        this.getThisMonthKWHForFeeders(multiDevice);
        this.getPowerParamtersFeeders(multiDevice);
      }
    }
    else{
      this.whatToDo = 'feeder'; 
      sessionStorage.setItem('FeederDevice', this.initialDevice!);
      sessionStorage.setItem('FeederInterval', '12hour');
      sessionStorage.setItem('FeederFeed', 'feeder');

      this.currentoperations(this.initialDevice!);
      this.getAlertsByFeederId(this.initialDevice!);
      this.feederGetDemandBarGraphByInterval(this.initialDevice!,'12hour');
      this.feederGetKWHByInterval(this.initialDevice!,'12hour');
      this.feederGetKVAHByInterval(this.initialDevice!,'12hour');
      this.feederGetKVARHByInterval(this.initialDevice!,'12hour');
      this.getTodayKWHForFeeders(this.initialDevice!);
      this.getYesterdayKWHForFeeders(this.initialDevice!);
      this.getThisMonthKWHForFeeders(this.initialDevice!);
      this.getPowerParamtersFeeders(this.initialDevice!);
    }
  }
  
  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.service.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.deviceOptions = devices.getFeederData;
          this.initialDevice = this.deviceOptions[0].feederUid;
          this.previousData();
          this.showingData()
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
          this.groupOptions = group.data;
        },
        (error) => {
          this.snackBar.open('Error while fetching devices Groups!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  currentoperations(device:string) {
    if (device) {
      this.service.currentoperations(device).subscribe(
        (newdata: any) => {
          let data = newdata.data[0];

          if (data) {
            this.service.fetchLatestEntry(this.selectedDevice).subscribe(
              (lastdata) => {
                const newData = lastdata.data[0];
                const dataPayload = Object.fromEntries(
                  Object.entries(newData).map(([key, value]) => [key, +String(value)])
                );
                this.dataMan(data,dataPayload);
              },
              (error) =>{
                this.snackBar.open('Error while fetching data!', 'Dismiss', {
                  duration: 2000
                });
              }
            );
          }
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  dataMan(data:any,latest:any){
    const instDataPercent = {
      max_current:(parseFloat(data.max_current)/parseFloat(data.max_current))*100,
      avg_current:(parseFloat(data.avg_current)/parseFloat(data.max_current))*100,
      min_current:(parseFloat(data.min_current)/parseFloat(data.max_current))*100,
      amps_r:(parseFloat(latest.current_1)/parseFloat(data.max_current))*100,
      amps_y:(parseFloat(latest.current_2)/parseFloat(data.max_current))*100,
      amps_b:(parseFloat(latest.current_3)/parseFloat(data.max_current))*100,
      avg_amps:(parseFloat(latest.current)/parseFloat(data.max_current))*100,

      max_phvoltage:(parseFloat(data.max_phvoltage)/parseFloat(data.max_phvoltage))*100,
      avg_phvoltage:(parseFloat(data.avg_phvoltage)/parseFloat(data.max_phvoltage))*100,
      min_phvoltage:(parseFloat(data.min_phvoltage)/parseFloat(data.max_phvoltage))*100,
      vln_r:(parseFloat(latest.voltage_1n)/parseFloat(data.max_phvoltage))*100,
      vln_y:(parseFloat(latest.voltage_2n)/parseFloat(data.max_phvoltage))*100,
      vln_b:(parseFloat(latest.voltage_3n)/parseFloat(data.max_phvoltage))*100,
      avg_vln:(parseFloat(latest.voltage_n)/parseFloat(data.max_phvoltage))*100,

      max_voltage:(parseFloat(data.max_voltage)/parseFloat(data.max_voltage))*100,
      avg_voltage:(parseFloat(data.avg_voltage)/parseFloat(data.max_voltage))*100,
      min_voltage:(parseFloat(data.min_voltage)/parseFloat(data.max_voltage))*100,
      vll_r:(parseFloat(latest.voltage_12)/parseFloat(data.max_voltage))*100,
      vll_y:(parseFloat(latest.voltage_23)/parseFloat(data.max_voltage))*100,
      vll_b:(parseFloat(latest.voltage_31)/parseFloat(data.max_voltage))*100,
      avg_vll:(parseFloat(latest.voltage_l)/parseFloat(data.max_voltage))*100,

      frequency:(parseFloat(latest.freq)/70)*100,
      v_thr_r:(parseFloat(latest.thd_v1n)/70)*100,
      v_thr_y:(parseFloat(latest.thd_v2n)/70)*100,
      v_thr_b:(parseFloat(latest.thd_v3n)/70)*100,
      i_thr_r:(parseFloat(latest.thd_i1)/70)*100,
      i_thr_y:(parseFloat(latest.thd_i2)/70)*100,
      i_thr_b:(parseFloat(latest.thd_i3)/70)*100
    }

    const instData = {
      max_current:data.max_current,
      avg_current:data.avg_current,
      min_current:data.min_current,
      amps_r:latest.current_1,
      amps_y:latest.current_2,
      amps_b:latest.current_3,
      avg_amps:latest.current,

      max_phvoltage:data.max_phvoltage,
      avg_phvoltage:data.avg_phvoltage,
      min_phvoltage:data.min_phvoltage,
      vln_r:latest.voltage_1n,
      vln_y:latest.voltage_2n,
      vln_b:latest.voltage_3n,
      avg_vln:latest.voltage_n,

      max_voltage:data.max_voltage,
      avg_voltage:data.avg_voltage,
      min_voltage:data.min_voltage,
      vll_r:latest.voltage_12,
      vll_y:latest.voltage_23,
      vll_b:latest.voltage_31,
      avg_vll:latest.voltage_l,

      frequency:latest.freq,
      v_thr_r:latest.thd_v1n,
      v_thr_y:latest.thd_v2n,
      v_thr_b:latest.thd_v3n,
      i_thr_r:latest.thd_i1,
      i_thr_y:latest.thd_i2,
      i_thr_b:latest.thd_i3
    }

    const intDataPercent = Object.entries(instDataPercent).reduce((acc, [key, value]) => {
      acc[key as keyof typeof instDataPercent] = Number.isInteger(value as number) ? value as number : Math.round(value as number);
      return acc;
    }, {} as Record<keyof typeof instDataPercent, number>);  
    
    const intData = Object.entries(instData).reduce((acc, [key, value]) => {
      acc[key as keyof typeof instData] = Number.isInteger(value as number) ? value as number : Number(value as number).toFixed(2);
      return acc;
    }, {} as Record<keyof typeof instData, number | string>);
    

    this.instantPercent=intDataPercent;
    this.instantData=intData;
  }

  getAlertsByFeederId(feederId:any) {
    if (feederId) {
      this.service.getAlertsByFeederId(feederId).subscribe(
        (data: any) => {
          this.alertData=data.getAlerts;
        },
        (error) => {
          this.snackBar.open('Error while fetching Alerts Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }
  
  feederGetDemandBarGraphByInterval(feederId:any,interval:any) {
    if (feederId) {
      this.service.feederGetDemandBarGraphByInterval(feederId,interval).subscribe(
        (data: any) => {
          const deviceData = data.maxKvaResults;

          this.CompanyId = this.authService.getCompanyId();
          if (this.CompanyId) {
            this.service.fetchMaxDemand(this.CompanyId).subscribe(
              (max: any) => {
                const companyMax = max.data.maxdemand;
                this.dataManBar(deviceData,companyMax);
              },
              (error) => {
                this.snackBar.open('Error while fetching Maximum data!', 'Dismiss', {
                  duration: 2000
                });
              }
            );
          }
        },
        (error) => {
          this.snackBar.open('Error while fetching Bar Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }
  
  feederGetDemandBarGraphByDate(feederId:any,start:any,end:any) {
    if (feederId) {
      this.service.feederGetDemandBarGraphByDate(feederId,start,end).subscribe(
        (data: any) => {
          const deviceData = data.maxKvaResults;

          this.CompanyId = this.authService.getCompanyId();
          if (this.CompanyId) {
            this.service.fetchMaxDemand(this.CompanyId).subscribe(
              (max: any) => {
                const companyMax = max.data.maxdemand;
                this.dataManBar(deviceData,companyMax);
              },
              (error) => {
                this.snackBar.open('Error while fetching Maximum data!', 'Dismiss', {
                  duration: 2000
                });
              }
            );
          }
        },
        (error) => {
          this.snackBar.open('Error while fetching Bar Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }
    
  feederGetKWHByInterval(feederId:any,interval:any) {
    if (feederId) {
      this.service.feederGetKWHByInterval(feederId,interval).subscribe(
        (data: any) => {
          this.activeKWH = data.total_kwh
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }
  
  feederGetKWHByDate(feederId:any,start:any,end:any) {
    if (feederId) {
      this.service.feederGetKWHByDate(feederId,start,end).subscribe(
        (data: any) => {
          this.activeKWH = data.total_kwh
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }
   
  feederGetKVAHByInterval(feederId:any,interval:any) {
    if (feederId) {
      this.service.feederGetKVAHByInterval(feederId,interval).subscribe(
        (data: any) => {
          this.KVAH = data.total_kvah;
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }
  
  feederGetKVAHByDate(feederId:any,start:any,end:any) {
    if (feederId) {
      this.service.feederGetKVAHByDate(feederId,start,end).subscribe(
        (data: any) => {
          this.KVAH = data.total_kvah;
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }
   
  feederGetKVARHByInterval(feederId:any,interval:any) {
    if (feederId) {
      this.service.feederGetKVARHByInterval(feederId,interval).subscribe(
        (data: any) => {
          this.KVARH = data.total_kvarh;
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }
  
  feederGetKVARHByDate(feederId:any,start:any,end:any) {
    if (feederId) {
      this.service.feederGetKVARHByDate(feederId,start,end).subscribe(
        (data: any) => {
          this.KVARH = data.total_kvarh;
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getTodayKWHForFeeders(feederId:any) {
    if (feederId) {
      this.service.getTodayKWHForFeeders(feederId).subscribe(
        (data: any) => {
          this.todayKWH = data.today_kwh;
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getYesterdayKWHForFeeders(feederId:any) {
    if (feederId) {
      this.service.getYesterdayKWHForFeeders(feederId).subscribe(
        (data: any) => {
          this.yesterdayKWH = data.yesterday_kwh;
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getThisMonthKWHForFeeders(feederId:any) {
    if (feederId) {
      this.service.getThisMonthKWHForFeeders(feederId).subscribe(
        (data: any) => {
          this.monthKWH = data.this_month_kwh;
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getPowerParamtersFeeders(feederId:any) {
    if (feederId) {
      this.service.getPowerParamtersFeeders(feederId).subscribe(
        (data: any) => {
          const gaugedata = data.sumResults[0];
          this.guageChange(gaugedata);
        },
        (error) => {
          this.snackBar.open('Error while fetching Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  
  guageChange(data:any){
    let kva = 0;
    let kw = 0;
    let kvar = 0;
    let pf = 0;

    kva = parseFloat(data.total_kva);
    kw = parseFloat(data.total_kw);
    kvar = parseFloat(data.total_kvar);
    pf = parseFloat(data.avg_pf);

    const kvachart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'KVAYguage');

    kvachart?.series[0].update({ 
      type: 'gauge',
      data: [kva]
    });

    kvachart?.yAxis[0].update({
      max: kva < 200 ? 200 : undefined
    });
    
    kvachart?.redraw();

    const kwchart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'KWYguage');

    kwchart?.series[0].update({ 
      type: 'gauge',
      data: [kw]
    });

    kwchart?.yAxis[0].update({
      max: kw < 200 ? 200 : undefined
    });

    const kvarchart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'KVRYguage');

    kvarchart?.series[0].update({ 
      type: 'gauge',
      data: [kvar]
    });

    kvarchart?.yAxis[0].update({
      max: kvar < 200 ? 200 : undefined
    });

    const pfchart = Highcharts.charts.find(chart => chart?.container.parentElement?.id === 'PFYguage');

    pfchart?.series[0].update({ 
      type: 'gauge',
      data: [pf]
    });

    pfchart?.yAxis[0].update({
      max: pf < 1 ? 1 : undefined
    });
  }

  dataManBar(barData:any,maximum:any){
    const data = barData;
    
    const max = maximum;
    
    const categories = data.map((obj: { device_uid: any; }) => obj.device_uid); // Extract device_uid values

    const maxDemandData = data.map((obj: { maxkva: any; }, index: any) => parseFloat(obj.maxkva)); // Extract maxkva values

    const liveDemandData = Array(data.length).fill(max);

    const maxNumber = Number(max);

    const result = data.map(() => maxNumber);
    
    const chartOptions: Highcharts.Options = {
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
        categories: categories
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
        type: 'column',
        name: 'Max Demand KVA',
        color: 'rgba(165,170,217,1)',
        data: result,
        pointPadding: 0.1,
        pointPlacement: 0
      }, {
        type: 'column',
        name: 'Live Demand KVA',
        color: 'rgba(126,86,134,.9)',
        data: maxDemandData,
        pointPadding: 0.25,
        pointPlacement: 0
      }]
    }; 
    
    Highcharts.chart('chartContainer', chartOptions); 
  }

  updateData(){
    if(this.selectedFeed=='feeder'){
      this.whatToDo = 'feeder'; 
      if (this.selectedFeederInterval == 'custom' && this.selectedDevice && this.feederStartDate.valid && this.feederEndDate.valid) {
        const startTime = this.datePipe.transform(this.feederStartDate.value, 'yyyy-MM-dd');
        const endTime = this.datePipe.transform(this.feederEndDate.value, 'yyyy-MM-dd');

      sessionStorage.setItem('FeederDevice', this.selectedDevice);
      sessionStorage.setItem('FeederInterval', this.selectedFeederInterval);
      sessionStorage.setItem('FeederFeed', 'feeder');
      sessionStorage.setItem('FeederStartDate', startTime!);
      sessionStorage.setItem('FeederEndDate', endTime!);

        this.getAlertsByFeederId(this.selectedDevice);
        this.feederGetDemandBarGraphByDate(this.selectedDevice,startTime,endTime);
        this.feederGetKWHByDate(this.selectedDevice,startTime,endTime);
        this.feederGetKVAHByDate(this.selectedDevice,startTime,endTime);
        this.feederGetKVARHByDate(this.selectedDevice,startTime,endTime);
        this.currentoperations(this.selectedDevice);
        this.getTodayKWHForFeeders(this.selectedDevice);
        this.getYesterdayKWHForFeeders(this.selectedDevice);
        this.getThisMonthKWHForFeeders(this.selectedDevice);
        this.getPowerParamtersFeeders(this.selectedDevice);
      }
      else if(this.selectedDevice && this.selectedFeederInterval && this.selectedFeederInterval != null && this.selectedFeederInterval!= undefined && this.selectedFeederInterval!='custom'){

      sessionStorage.setItem('FeederDevice', this.selectedDevice);
      sessionStorage.setItem('FeederInterval', this.selectedFeederInterval);
      sessionStorage.setItem('FeederFeed', 'feeder');

        this.currentoperations(this.selectedDevice);
        this.getAlertsByFeederId(this.selectedDevice);
        this.feederGetDemandBarGraphByInterval(this.selectedDevice,this.selectedFeederInterval);
        this.feederGetKWHByInterval(this.selectedDevice,this.selectedFeederInterval);
        this.feederGetKVAHByInterval(this.selectedDevice,this.selectedFeederInterval);
        this.feederGetKVARHByInterval(this.selectedDevice,this.selectedFeederInterval);
        this.getTodayKWHForFeeders(this.selectedDevice);
        this.getYesterdayKWHForFeeders(this.selectedDevice);
        this.getThisMonthKWHForFeeders(this.selectedDevice);
        this.getPowerParamtersFeeders(this.selectedDevice);
      }
      else{
        this.snackBar.open('Select appropriate parameters!', 'Dismiss', {
          duration: 2000
        });
      }
    }else if(this.selectedFeed=='vgroup'){
      this.whatToDo = 'vgroup'; 
      if (this.selectedVirtualGroupInterval == 'custom' && this.selectedMultipleDevices && this.virtualStartDate.valid && this.virtualEndDate.valid) {
        const startTime = this.datePipe.transform(this.virtualStartDate.value, 'yyyy-MM-dd');
        const endTime = this.datePipe.transform(this.virtualEndDate.value, 'yyyy-MM-dd');

        const string = this.selectedMultipleDevices.join(',');

        sessionStorage.setItem('FeederDevice', string);
        sessionStorage.setItem('FeederInterval', this.selectedVirtualGroupInterval);
        sessionStorage.setItem('FeederFeed', 'vgroup');
        sessionStorage.setItem('FeederStartDate', startTime!);
        sessionStorage.setItem('FeederEndDate', endTime!);
        
        this.getAlertsByFeederId(this.selectedMultipleDevices);
        this.feederGetDemandBarGraphByDate(this.selectedMultipleDevices,startTime,endTime);
        this.feederGetKWHByDate(this.selectedMultipleDevices,startTime,endTime);
        this.feederGetKVAHByDate(this.selectedMultipleDevices,startTime,endTime);
        this.feederGetKVARHByDate(this.selectedMultipleDevices,startTime,endTime);
        this.getTodayKWHForFeeders(this.selectedMultipleDevices);
        this.getYesterdayKWHForFeeders(this.selectedMultipleDevices);
        this.getThisMonthKWHForFeeders(this.selectedMultipleDevices);
        this.getPowerParamtersFeeders(this.selectedMultipleDevices);
      }
      else if(this.selectedMultipleDevices && this.selectedVirtualGroupInterval && this.selectedVirtualGroupInterval != null && this.selectedVirtualGroupInterval!= undefined && this.selectedVirtualGroupInterval!='custom'){
      
        const string = this.selectedMultipleDevices.join(',');

      sessionStorage.setItem('FeederDevice', string);
      sessionStorage.setItem('FeederInterval', this.selectedVirtualGroupInterval);
      sessionStorage.setItem('FeederFeed', 'vgroup');

        this.getAlertsByFeederId(this.selectedMultipleDevices);
        this.feederGetDemandBarGraphByInterval(this.selectedMultipleDevices,this.selectedVirtualGroupInterval);
        this.feederGetKWHByInterval(this.selectedMultipleDevices,this.selectedVirtualGroupInterval);
        this.feederGetKVAHByInterval(this.selectedMultipleDevices,this.selectedVirtualGroupInterval);
        this.feederGetKVARHByInterval(this.selectedMultipleDevices,this.selectedVirtualGroupInterval);
        this.getTodayKWHForFeeders(this.selectedMultipleDevices);
        this.getYesterdayKWHForFeeders(this.selectedMultipleDevices);
        this.getThisMonthKWHForFeeders(this.selectedMultipleDevices);
        this.getPowerParamtersFeeders(this.selectedMultipleDevices);
      }
      else{
        this.snackBar.open('Select appropriate parameters!', 'Dismiss', {
          duration: 2000
        });
      }
    }else{
      this.snackBar.open('Select appropriate parameters!', 'Dismiss', {
        duration: 2000
      });
    }  
  }

  KVAYguage: Highcharts.Options = {
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
      max:0 < 200 ? 200 : undefined,
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
      data: [0],
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

  KWYguage: Highcharts.Options = {
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
      max:0 < 200 ? 200 : undefined,
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
      data: [0],
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

  KVRYguage: Highcharts.Options = {
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
      max: 0 < 200 ? 200 : undefined,
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
      data: [0],
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

  PFYguage: Highcharts.Options = {
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
      max:0 < 1 ? 1 : undefined,
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
      data: [0],
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