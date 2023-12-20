import { Component } from '@angular/core';
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

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

  CompanyId!:string|null;
  dataSource2: any;
  displayedColumns: string[] = ['Device', 'Date', 'Time', 'ORP', 'Pump1', 'Pump2'];
  dataSource = new MatTableDataSource<Devices>(ELEMENT_DATA);
  panelOpenState = false;
  first_device!:string;
  data:any
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;
  
  device_uid = new FormControl('', [Validators.required]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);

  constructor(
    public DashDataService: DashboardService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
  ){}

  ngOnInit(){
    this.getUserDevices();
  }

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.dataSource2 = devices;
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
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

  select(deviceStat:any){
  }

  applyFilter(){}

}

export interface Devices {
  device_name: string;
  pump1: string;
  pump2: string;
  Location: string;
  device_latitude: number;
  device_longitude: number;
  date: string | null;
  time: string | null;
  date_time: string;
}

const ELEMENT_DATA: Devices[] = [];
