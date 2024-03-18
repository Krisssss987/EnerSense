import { Component, ViewChild } from '@angular/core';
import { DashboardService } from '../dash_service/dashboard.service';
import { AuthService } from 'src/app/login/auth/auth.service';
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

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      const subscription = this.DashDataService.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.dataSource2 = devices.getFeederData;
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

  downloadCSV() {
    const csv = Papa.unparse(this.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'report_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  downloadExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'report_data.xlsx');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName);
  }

  downloadPDF() {
    const jsPDF = require('jspdf');

    const columns = Object.keys(this.data[0]);
    const rows = this.data.map((item: Record<string, string | number>) => Object.values(item));

    const doc = new jsPDF.default(); // Use .default to access the class constructor

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save('report_data.pdf');
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
  }
}

const ELEMENT_DATA : any[]= [];
