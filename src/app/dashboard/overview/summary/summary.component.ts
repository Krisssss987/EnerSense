import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../dash_service/dashboard.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth/auth.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
  CompanyId: any;
  subscriptions: Subscription[] = [];

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

  ngOnDestroy(){
    this.unsubscribeFromTopics();
  }
  
  unsubscribeFromTopics() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
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
      const subscription = this.DashDataService.overviewSummary(this.CompanyId).subscribe(
        (device: any) => {
          this.deviceData = new MatTableDataSource(device.data);
        },
        (error) => {
          this.snackBar.open('Error while fetching Devices Summary!', 'Dismiss', {
            duration: 2000
          });
        }
      );
      this.subscriptions.push(subscription)
    }
  }  
}


const ELEMENT_DATA: any[] = [];
