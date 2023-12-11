import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../../dash_service/dashboard.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate!: Date;
  public maxDate!: Date;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public disableMinute = false;
  public hideTime = false;

  CompanyEmail!: string | null;
  selectedDevice!: FormControl;
  selectedDeviceInterval: string ='';
  deviceOptions: any[] = [];
  selectedRadioButton: string = 'Last';
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);
  CompanyId!: string | null;
  deviceID!:string;

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }

  constructor(
    private DashDataService: DashboardService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.adjustDialogWidth();
    this.getUserDevices();
  }

  open(device: any){
    this.deviceID = device.deviceid;
  }

  updateStartDate(event: any): void {
    const selectedStartDate = event.value;
    this.startDate = selectedStartDate;
  }

  updateEndDate(event: any): void {
    const selectedEndDate = event.value;
    if (!this.startDate || selectedEndDate >= this.startDate) {
      this.endDate = selectedEndDate;
    } else {
      this.endDate = this.currentDate;
      console.error('End date must be greater than or equal to the start date');
    }
  }

  adjustDialogWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      this.dialogRef.updateSize('90%', '');
    } else if (screenWidth <= 960) {
      this.dialogRef.updateSize('70%', '');
    } else {
      this.dialogRef.updateSize('400px', '');
    }
  }

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    console.log(this.CompanyId);
    if (this.CompanyId) {
      this.DashDataService.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.deviceOptions = devices;
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if(this.selectedRadioButton==='Custom' && this.start_date.valid && this.end_date.valid && this.deviceID!=null||undefined){
      console.log(this.deviceID,this.selectedDeviceInterval);
      this.DashDataService.setDeviceId(this.deviceID);
      this.DashDataService.setInterval('Custom');
      this.DashDataService.setStartDate(this.start_date.value??'');
      this.DashDataService.setEndDate(this.end_date.value??'');
    }
    else if(this.selectedRadioButton!='Custom' && this.deviceID!=null||undefined ){
      if(this.selectedDeviceInterval==null||''||undefined){
        this.snackBar.open('Please Select appropriate Filter!', 'Dismiss', {
          duration: 2000
        });  
      }
      else{
        this.DashDataService.setDeviceId(this.deviceID);
        this.DashDataService.setInterval(this.selectedDeviceInterval);    
      }
    }
    else if(this.selectedRadioButton==='Custom' && this.start_date.valid && this.end_date.valid && this.deviceID==null||undefined||''){
      this.snackBar.open('Please Select Device!', 'Dismiss', {
        duration: 2000
      });
    }
    else if(this.selectedRadioButton==='Custom' && this.start_date.invalid && this.end_date.invalid && this.deviceID!=null||undefined||''){
      this.snackBar.open('Please Select Filter!', 'Dismiss', {
        duration: 2000
      });
    }
    else{
      this.snackBar.open('Please Select Device and Filter!', 'Dismiss', {
        duration: 2000
      });
    }
  }
}
