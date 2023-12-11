import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { DashService } from '../../dash.service';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { DashboardService } from '../../dash_service/dashboard.service';
HighchartsMore(Highcharts);

interface GraphDataItem {
  id: number;
  meter_name: string;
  shift_name: string;
  group_name: string;
  virtual_group: string;
  kwh_value: number;
  timestamp: string;
}

@Component({
  selector: 'app-consuption',
  templateUrl: './consuption.component.html',
  styleUrls: ['./consuption.component.css']
})
export class ConsuptionComponent implements OnInit, AfterViewInit {

  graphdata = [] ;
   MeterName: any;
   KWHValues: number[] = [];

   ShiFTNAmes:string[] = [];

   KWHDATASHIFTA:number[]=[];
   KWHDATASHIFTB:number[]=[];


  feeders =[
    { value: '6 Th Boiler', label: 'O6 Th Boiler' },
    { value: 'air compressor', label: 'air compressor' },
    { value: 'Borewell no 4', label: 'Borewell No 4' }
  ]

  intervals = [
    { value: 'Yesterday', label: 'Yesterday' },
    { value: 'This Month', label: 'This Month' },
    { value: 'Last Month', label: 'Last Month' },
    { value: 'Date', label: 'Date' },
    { value: 'Date&Time', label:'Date&Time' },
  ]

  shifts =[
    { value: 'Shift A', label: 'Shift A' },
    { value: 'Shift B', label: 'Shift B' },
  ]
  data: any;
  
  constructor(private service: DashboardService) {} 
  
  ngOnInit(): void {

  }
  @ViewChild('chart1', { static: false }) chart1Container!: ElementRef;


  ngAfterViewInit() {
    this.consumption(this.chart1Container.nativeElement); 
    this.getgraphdata();
  }

  // getgraphdata(){
  //   this.service.getConsuptionGraphdata().subscribe((data) => {
  //     this.graphdata = data;
  //     console.log(this.graphdata);
  //   });
  // }

  getgraphdata() {
    this.service.getConsuptionGraphdata().subscribe((data) => {
      this.graphdata = data;

      this.MeterName = [];
      this.KWHValues = [];
      this.ShiFTNAmes = [];
  

      this.graphdata.forEach((item: GraphDataItem) => {
        this.MeterName.push(item.meter_name);

        this.KWHValues.push(item.kwh_value);
        this.ShiFTNAmes.push(item.shift_name);

        if(item.shift_name == 'ShiftA'){
          this.KWHDATASHIFTA.push(item.kwh_value);
        }
        else{
          this.KWHDATASHIFTB.push(item.kwh_value);
        }
        

      });


      console.log(this.MeterName);


      const container = this.chart1Container.nativeElement;
      this.consumption(container);
    });
  }
  



  

  consumption(container: HTMLElement) {
    Highcharts.chart(container, {
      chart: {
        type: 'column',
        plotBorderWidth: 0, 
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: this.MeterName,
      },
      yAxis: {
        title: {
          text: 'KWH'
        },
        min: 0,
        max: 300,
        gridLineWidth: 0,
        plotLines: [
          {
            value: 0,
            color: 'transparent',
            width: 0,
          },
          {
            value: 25,
            color: 'transparent',
            width: 0,
          },
          {
            value: 50,
            color: 'transparent',
            width: 0,
          },
          {
            value: 75,
            color: 'transparent',
            width: 0,
          },
          {
            value: AutofillMonitor,
            color: 'transparent',
            width: 0,
          },
        ]
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          lineWidth: 0,
        }
      },
      legend: {
        symbolRadius: 0,
        verticalAlign: 'top',
      },
      series: [{
        name: 'shiftA',
        data: [this.KWHDATASHIFTA,]
      },
      {
        name: 'shiftB',
        data: [this.KWHDATASHIFTB]
      },
   
    ] as any
    } as Highcharts.Options);
  }


  

}


