import { Component, ViewChild } from '@angular/core';
import { DashboardService } from '../dash_service/dashboard.service';
import { AuthService } from 'src/app/authentication/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tod-report',
  templateUrl: './tod-report.component.html',
  styleUrls: ['./tod-report.component.css']
})

export class TodReportComponent {
  CompanyId!:string|null;
  dataSource2: any;
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  first_device!:string;
  data:any;
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;
  errorMessage!: string;
  
  device_uid = new FormControl('', [Validators.required]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);
  selectedDevice: any[] = [];
  savedID: any;
  start!: string|null;
  end!: string|null;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['date', 'ttl_kwh', 'ttl_kvah', 'a_kvah', 'a_kva', 'a_percent', 'b_kwh_6_to_9', 'b_kwh_12_to_18', 'b_kvah', 'b_kva', 'c_kvah', 'c_kva', 'd_kvah', 'd_kva', 'percent', 'solar_kwh', 'demand_charges', 'energy_charges', 'total_charges', 'unit_rate'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    public DashDataService: DashboardService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
  ){}

  ngOnInit(){
    this.getUserDevices();
  }

  ngOnDestroy(){
    this.unsubscribeFromTopics();
  }
  
  unsubscribeFromTopics() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  showingData(){
    const device = sessionStorage.getItem('todDevice');
    const start = sessionStorage.getItem('tod_start_date');
    const end = sessionStorage.getItem('tod_end_date');

    this.device_uid = new FormControl(device, [Validators.required]);
    this.start_date = new FormControl(start, [Validators.required]);
    this.end_date = new FormControl(end, [Validators.required]);
  }

  removeTotalKwh(dataArray: any[]): any[] {
    return dataArray.map(obj => {
      const { zone_kva_c, zone_kva_d, zone_kwh_d, zone_kvah_c, zone_kvah_d, ...rest } = obj;
      return rest;
    });
  } 

  previousData(firstDevice:string){
    const device = sessionStorage.getItem('todDevice');
    const start = sessionStorage.getItem('tod_start_date');
    const end = sessionStorage.getItem('tod_end_date');

    if(device && start && end){
      const data = {
        device_uid: device,
        startDate: start,
        endDate: end
      }

      const subscription = this.DashDataService.todReport(data).subscribe(
        (data) => {
          const actualData = data.data;
          this.data=actualData;
          this.dataSource = new MatTableDataSource(actualData);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Loading Data Failed.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      );
      this.subscriptions.push(subscription)
    }else{
      const previousDate = new Date(this.currentDate);
      previousDate.setDate(this.currentDate.getDate() - 1);
      const startin = this.datePipe.transform(previousDate, 'yyyy-MM-dd')??'';
      const endin = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')??''; 

      sessionStorage.setItem('todDevice',firstDevice);
      sessionStorage.setItem('tod_start_date',startin);
      sessionStorage.setItem('tod_end_date',endin);

      const data = {
        device_uid: firstDevice,
        startDate: startin,
        endDate: endin
      }

      const subscription = this.DashDataService.todReport(data).subscribe(
        (data) => {
          const actualData = data.data;
          this.data=actualData;
          this.dataSource = new MatTableDataSource(actualData);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Loading Data Failed.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      );
      this.subscriptions.push(subscription)
    }    
  }

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      const subscription = this.DashDataService.deviceDetails(this.CompanyId,'all').subscribe(
        (devices: any) => {
          this.dataSource2 = devices.getFeederData;
          const initialDevice = devices.getFeederData[0].feederUid;
          this.previousData(initialDevice);
          this.showingData();
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
      this.subscriptions.push(subscription)
    }
  }

  downloadExcel() {
    const newArray = this.removeTotalKwh(this.data);

    const nullArray = {};
    newArray.push(nullArray)

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);

    // Merge the columns "A Zone KWH"
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } });
    worksheet['A1'].v = "Date";

    // Merge total_kwh into two rows and rename it to "Total KWH"
    worksheet['!merges'].push({ s: { r: 0, c: 1 }, e: { r: 1, c: 1 } });
    worksheet['B1'].v = "Total KWH";

    // Merge total_kvah into two rows and rename it to "Total KVAH"
    worksheet['!merges'].push({ s: { r: 0, c: 2 }, e: { r: 1, c: 2 } });
    worksheet['C1'].v = "Total KVAH";

    // Add the new column names "KVAH" and "KVA" for "zone_kvah_a" and "zone_kva_a" below "A Zone KWH"
    worksheet['!merges'].push({ s: { r: 0, c: 3 }, e: { r: 0, c: 4 } });
    worksheet['D1'].v = "A Zone KWH 22:00 to 06:00";
    worksheet['D2'].v = "KVAH";
    worksheet['E2'].v = "KVA";

    // Merge total_kvah into two rows and rename it to "Total KVAH"
    worksheet['!merges'].push({ s: { r: 0, c: 5 }, e: { r: 1, c: 5 } });
    worksheet['F1'].v = "B Zone KWH 6:00 to 9:00";

    // Merge total_kvah into two rows and rename it to "Total KVAH"
    worksheet['!merges'].push({ s: { r: 0, c: 6 }, e: { r: 1, c: 6 } });
    worksheet['G1'].v = "B Zone KWH 12:00 to 18:00";

    // Add the new column names "KVAH" and "KVA" for "zone_kvah_a" and "zone_kva_a" below "A Zone KWH"
    worksheet['!merges'].push({ s: { r: 0, c: 7 }, e: { r: 0, c: 8 } });
    worksheet['H1'].v = "Total B Zone KWH";
    worksheet['H2'].v = "KVAH";
    worksheet['I2'].v = "KVA";

    // Add the new column names "KVAH" and "KVA" for "zone_kvah_a" and "zone_kva_a" below "A Zone KWH"
    worksheet['!merges'].push({ s: { r: 0, c: 9 }, e: { r: 0, c: 10 } });
    worksheet['J1'].v = "C Zone KWH 9:00 to 12:00";
    worksheet['J2'].v = "KVAH";
    worksheet['K2'].v = "KVA";

    // Add the new column names "KVAH" and "KVA" for "zone_kvah_a" and "zone_kva_a" below "A Zone KWH"
    worksheet['!merges'].push({ s: { r: 0, c: 11 }, e: { r: 0, c: 12 } });
    worksheet['L1'].v = "D Zone KWH 18:00 to 22:00";
    worksheet['L2'].v = "KVAH";
    worksheet['M2'].v = "KVA";

    // Insert the respective values for "KVAH" and "KVA" from "zone_kvah_a" and "zone_kva_a" below the merged column
    for (let i = 0; i < this.data.length; i++) {
        const rowData = this.data[i];
        worksheet[`A${i + 3}`] = { v: rowData.date_time };
        worksheet[`B${i + 3}`] = { v: rowData.total_kwh };
        worksheet[`C${i + 3}`] = { v: rowData.total_kvah };
        worksheet[`D${i + 3}`] = { v: rowData.zone_kvah_a };
        worksheet[`E${i + 3}`] = { v: rowData.zone_kva_a };
        worksheet[`F${i + 3}`] = { v: rowData.zone_kwh_b1 };
        worksheet[`G${i + 3}`] = { v: rowData.zone_kwh_b2 };
        worksheet[`H${i + 3}`] = { v: rowData.zone_kvah_b1 };
        worksheet[`I${i + 3}`] = { v: rowData.zone_kva_b1 };
        worksheet[`J${i + 3}`] = { v: rowData.zone_kvah_c };
        worksheet[`K${i + 3}`] = { v: rowData.zone_kva_c };
        worksheet[`L${i + 3}`] = { v: rowData.zone_kvah_d };
        worksheet[`M${i + 3}`] = { v: rowData.zone_kva_d };
    }

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(dataBlob, 'tod_report.xlsx');
  }

  updateStartDate(event: MatDatepickerInputEvent<any, any>): void {
    const selectedStartDate = event.value;
    this.startDate = selectedStartDate;
  }

  updateEndDate(event: MatDatepickerInputEvent<any, any>): void {
    const selectedEndDate = event.value;
    if (!this.startDate || selectedEndDate >= this.startDate) {
      this.endDate = selectedEndDate;
    } else {
      this.endDate = this.currentDate;
      console.error('End date must be greater than or equal to the start date');
    }
  }

  applyFilter(){
    if(this.device_uid.valid && this.start_date.valid && this.end_date.valid){
    const formattedStartDate = this.datePipe.transform(this.start_date.value, 'yyyy-MM-dd')??'';
    const formattedEndDate = this.datePipe.transform(this.end_date.value, 'yyyy-MM-dd')??'';

    sessionStorage.setItem('todDevice', this.device_uid.value!);
    sessionStorage.setItem('tod_start_date',formattedStartDate);
    sessionStorage.setItem('tod_end_date',formattedEndDate);

    const data = {
      device_uid: this.device_uid.value,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }

    const subscription = this.DashDataService.todReport(data).subscribe(
      (data) => {
        const actualData = data.data;
        this.data=actualData;
        this.dataSource = new MatTableDataSource(actualData);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        this.snackBar.open(
          error.error.message || 'Loading Data Failed.',
          'Dismiss',
          { duration: 2000 }
        );
      }
    );
    this.subscriptions.push(subscription)
    }
  }
}

const ELEMENT_DATA : any[]= [];
