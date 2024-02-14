import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../dash_service/dashboard.service';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  CompanyId: any;

  constructor(
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SummaryComponent>,
    public DashDataService: DashboardService,
    public authService: AuthService
  ){
  }
  
  deviceData=new MatTableDataSource<any>(ELEMENT_DATA);
  deviceColumns: string[] = ['name','id','today','yesterday','this_month','last_month'];

  ngOnInit(): void {
    this.summary();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }
  private adjustDialogWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      this.dialogRef.updateSize('90%', '');
    } else if (screenWidth <= 960) {
      this.dialogRef.updateSize('70%', '');
    } else {
      this.dialogRef.updateSize('600px', '');
    }
  }

  summary() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.overviewSummary(this.CompanyId).subscribe(
        (device: any) => {
          this.deviceData = new MatTableDataSource(device.data);
        },
        (error) => {
          this.snackBar.open('Error while fetching Devices Summary!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }
  
}


const ELEMENT_DATA: any[] = [];
