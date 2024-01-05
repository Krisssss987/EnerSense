import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../dash_service/dashboard.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent {

  CompanyId!:string|null;

  constructor(
    private DashDataService: DashboardService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
  ) {}
  
  ngOnInit() {
    this.getUserDevices();
    this.getUsers();
  }
  
  userColumns: string[] = ['usericon','name','email','designation','contact','plant','privileges','action'];
  feederColumns: string[] = ['feederuid','name','location','group','groupname','threshold','action'];
  alertColumns: string[] = ['name','feedername','parameter','condition','threshold','repeat','start','end','sms','username','action'];
  shiftColumns: string[] = ['shiftcode','start','end','total','action'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          console.log(devices);
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getUsers() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.userDetails(this.CompanyId).subscribe(
        (user: any) => {
          console.log(user);
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

}


const ELEMENT_DATA: any[] = [];
