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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'] , 
})
export class ReportComponent {

  CompanyId!:string|null;
  dataSource2: any;
  displayedColumns: string[] = ['Device UID', 'Date Time'];
  predefinedColumns: string[] = ['Device UID', 'Date Time'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  panelOpenState = false;
  first_device!:string;
  data:any;
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;
  parameterOptions:any[] = [];
  errorMessage!: string;
  
  device_uid = new FormControl('', [Validators.required]);
  parameters = new FormControl('', [Validators.required]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);
  selectedDevice: any[] = [];
  revertedArray: any[] = [];
  savedID: any;
  start!: string|null;
  end!: string|null;
  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    public DashDataService: DashboardService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
  ){}

  ngOnInit(){
    this.getUserDevices();
    this.getParameters();
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
      const subscription = this.DashDataService.deviceDetails(this.CompanyId,'all').subscribe(
        (devices: any) => {
          this.dataSource2 = devices.getFeederData;
          const savedParameters = sessionStorage.getItem('reportParameters');
          const savedID = sessionStorage.getItem('reportDevice');
          if (savedParameters === null || savedParameters === undefined || savedParameters === ''){
            const reportParameters = ['KVA','KW','KVAR','PF','Current','Voltage N'];
            this.selectedDevice = reportParameters;
            const initialID = this.dataSource2[0].feederUid;    
            sessionStorage.setItem('reportDevice', initialID);
            this.savedID = sessionStorage.getItem('reportDevice');
            const parametersArray: string[] = Array.isArray(reportParameters) ? reportParameters : [reportParameters];
            this.displayedColumns = [...this.predefinedColumns, ...parametersArray];
            this.displayedColumns = Array.from(new Set(this.displayedColumns));
            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
            const previousDate = new Date(this.currentDate);
            previousDate.setDate(this.currentDate.getDate() - 1);
            this.start = this.datePipe.transform(previousDate, 'yyyy-MM-dd')??'';
            this.end = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')??'';  
            sessionStorage.setItem('report_start_date',this.start)        
            sessionStorage.setItem('report_end_date',this.end)   
            this.startDate = new Date(this.start);   
            
            this.revertedArray = this.displayedColumns.map(str => {
              return str.replace(/ /g, '_').toLowerCase();
            });

            const data = {
              device_uid: initialID,
              start_time: this.start,
              end_time: this.end,
              parameters: this.revertedArray,
            }

            const subscription = this.DashDataService.getreport(data).subscribe(
              (data) => {
                const actualData = data.data;
                actualData.forEach((data: { date_time: string | number | Date | null; }) => {
                  data.date_time = this.datePipe.transform(data.date_time, 'yyyy-MM-dd HH:mm:ss');
                });
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
                this.errorMessage = error.error.message || '';
              }
            );
            this.subscriptions.push(subscription)
          }
          else {
            const reportParameters = JSON.parse(savedParameters);
            this.selectedDevice = reportParameters;
            this.savedID = savedID;
            const parametersArray: string[] = Array.isArray(reportParameters) ? reportParameters : [reportParameters];
            this.displayedColumns = [...this.predefinedColumns, ...parametersArray];
            this.displayedColumns = Array.from(new Set(this.displayedColumns));
            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
            const s = sessionStorage.getItem('report_start_date');
            this.start = this.datePipe.transform(s, 'yyyy-MM-dd')??'';
            const e = sessionStorage.getItem('report_end_date');
            this.end = this.datePipe.transform(e, 'yyyy-MM-dd')??'';
            if (s !== null) {
              this.startDate = new Date(s);
            } else {
              this.startDate = new Date();
            }

            this.revertedArray = this.displayedColumns.map(str => {
              return str.replace(/ /g, '_').toLowerCase();
            });

            const data = {
              device_uid: savedID,
              start_time: this.start,
              end_time: this.end,
              parameters: this.revertedArray,
            }

            const subscription = this.DashDataService.getreport(data).subscribe(
              (data) => {
                const actualData = data.data;
                actualData.forEach((data: { date_time: string | number | Date | null; }) => {
                  data.date_time = this.datePipe.transform(data.date_time, 'yyyy-MM-dd HH:mm:ss');
                });
                
                this.dataSource = new MatTableDataSource(actualData);
                this.data=actualData;
                this.dataSource.paginator = this.paginator;
              },
              (error) => {
                this.snackBar.open(
                  error.error.message || 'Loading Data Failed.',
                  'Dismiss',
                  { duration: 2000 }
                );
                this.errorMessage = error.error.message || '';
              }
            );
            this.subscriptions.push(subscription)
          }
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

  getParameters() {
    const subscription = this.DashDataService.getreportparameters().subscribe(
      (parameters: string[]) => {
        this.parameterOptions= parameters.map(str => {
          let transformedStr = str.replace(/_/g, ' ');
          transformedStr = transformedStr.replace(/\b\w/g, match => match.toUpperCase());
          transformedStr = transformedStr.replace(/\b\w{1,4}\b/g, match => match.toUpperCase());
          return transformedStr;
        });
      },
      (error) => {
        this.snackBar.open('Error while fetching Parameters!', 'Dismiss', {
          duration: 2000
        });
        this.errorMessage = error.error.message || '';
      }
    );
    this.subscriptions.push(subscription)
  }

  transformString(input: string): string {
    let transformedStr = input.replace(/_/g, ' ');
    transformedStr = transformedStr.replace(/\b\w/g, match => match.toUpperCase());
    transformedStr = transformedStr.replace(/\b\w{1,4}\b/g, match => match.toUpperCase());
    return transformedStr;
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
    if (this.device_uid.valid && this.start_date.valid && this.end_date.valid){
      const selectedParameters: string | string[] = this.parameters.value!;
      const serializedParameters = JSON.stringify(selectedParameters);
      sessionStorage.setItem('reportParameters', serializedParameters);
      sessionStorage.setItem('reportDevice', this.device_uid.value!);
      const parametersArray: string[] = Array.isArray(selectedParameters) ? selectedParameters : [selectedParameters];
      this.displayedColumns = [...this.predefinedColumns, ...parametersArray];
      this.displayedColumns = Array.from(new Set(this.displayedColumns));
      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      const formattedStartDate = this.datePipe.transform(this.start_date.value, 'yyyy-MM-dd')??'';
      const formattedEndDate = this.datePipe.transform(this.end_date.value, 'yyyy-MM-dd')??'';
      sessionStorage.setItem('report_start_date',formattedStartDate);
      sessionStorage.setItem('report_end_date',formattedEndDate);

      this.revertedArray = this.displayedColumns.map(str => {
        return str.replace(/ /g, '_').toLowerCase();
      });

      const data = {
        device_uid: this.device_uid.value,
        start_time: formattedStartDate,
        end_time: formattedEndDate,
        parameters: this.revertedArray,
      }

      const subscription = this.DashDataService.getreport(data).subscribe(
        (data) => {
          const actualData = data.data;
          actualData.forEach((data: { date_time: string | number | Date | null; }) => {
            data.date_time = this.datePipe.transform(data.date_time, 'yyyy-MM-dd HH:mm:ss');
          });
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
