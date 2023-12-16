import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dash_service/dashboard.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { MatSelectChange } from '@angular/material/select'; // Import MatSelectChange
HighchartsMore(Highcharts);

@Component({
  selector: 'app-consuption',
  templateUrl: './consuption.component.html',
  styleUrls: ['./consuption.component.css']
})
export class ConsuptionComponent implements OnInit {

  graphdata = [];
  MeterName: any;
  KWHValues: number[] = [];
  data: any;
  DeviceID:any;

  devices: any[] = [];

  intervals = [

    { value: '15min', label: '15min' },
    { value: '30min', label: '30min' },
    { value: '1hour', label: '1hour' },
    { value: '12hour', label: '12hour' },
    { value: '1day', label: '1day' },
    { value: '30day', label: '30day' },
    { value: '1year', label: '1year' },
  ];

  shifts=[
    {value:'ShiftA', label:'SHIFT A'},
    {value:'ShiftB', label:'ShIFTB'},
  ]

  selectedInterval: string = '1hour'; // Default interval value
  selectedDevice: string ='';
  selectedshift:string='ShiftA';

  constructor(private service: DashboardService) {}

  @ViewChild('chart', { static: false }) chartContainer!: ElementRef;

  ngOnInit(): void {
    this.fetchData(); // Initial data fetch
    this.fetchdevicedata();
  }

  // Function to fetch data based on the selected interval
  fetchData(): void {
    this.service.getconsuptiondata(this.selectedInterval,this.selectedDevice,this.selectedshift).subscribe((result) => {
      this.data = result; 
      // console.log(this.data);
      this.renderHarmonicChart();
    });
  }

  fetchdevicedata():void{
    this.service.getdevicename(this.selectedInterval).subscribe((result) => {
      this.data = result;

      // Update the devices array with unique devices from the API response
      this.updateDevices(result);

      this.renderHarmonicChart();
    });
  }
 


  updateDevices(apiData: any[]): void {
    this.devices = [];

    apiData.forEach(item => {
      const device = item.device;

      if (!this.devices.some((d) => d.value === device)) {
        this.devices.push({ value: device, label: device });
      }
    });
  }


  onIntervalChange(): void {
    this.fetchData();
  }
  




  onGenerateButtonClick(): void {
    if (this.selectedDevice) {
      this.DeviceID = this.selectedDevice;
       console.log(this.selectedDevice,this.selectedInterval,this.selectedshift);
    

      this.fetchData();
    } else {
      console.error('No device selected.');
    }
  }

  // Function to render harmonic chart
  renderHarmonicChart(): void {
    if (this.chartContainer) {
      const chartData = {
        categories: this.data.map((item: { data: { date_time: any; }; }) => item.data.date_time), // Assuming device names are to be displayed on X-axis
        series: [
          { name: 'kvah', data: this.data.map((item: { data: { kvah: any; }; }) => item.data.kvah) },
          { name: 'kwh', data: this.data.map((item: { data: { kwh: any; }; }) => item.data.kwh) },
          { name: 'imp_kvarh', data: this.data.map((item: { data: { imp_kvarh: any; }; }) => item.data.imp_kvarh) },
          { name: 'exp_kvarh', data: this.data.map((item: { data: { exp_kvarh: any; }; }) => item.data.exp_kvarh) },
          { name: 'kvarh', data: this.data.map((item: { data: {kvarh: any; }; }) => item.data.kvarh) },
        ],
      };

      this.harmonic(this.chartContainer.nativeElement, chartData);
    } else {
      console.error('Chart container not available.');
    }
  }


  onDeviceSelectionChange(event: MatSelectChange): void {
    this.selectedDevice = event.value;
  }

  harmonic(container: HTMLElement, chartData: any) {
    Highcharts.chart(container, {
      chart: {
        type: 'spline',
        plotBorderWidth: 0, 
      },
      title: {
        text: 'Consumption Chart'
      },
      xAxis: {
        categories: chartData.categories
      },
      yAxis: {
        title: {
          text: 'Values'
        },
        min: 0,
        gridLineWidth: 0, // Remove the gridlines
      },
      legend: {
        symbolRadius: 0, // Set the symbol radius to 0 to make the legend symbols rectangular
        verticalAlign: 'top', // Position the legends above the graph
      },
      series: chartData.series
    } as Highcharts.Options);
  }

  
}
