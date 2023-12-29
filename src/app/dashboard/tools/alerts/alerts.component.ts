import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditAlertsComponent } from './edit-alerts/edit-alerts.component';
import { DashboardService } from '../../dash_service/dashboard.service';
import{ DashService } from '../../dash.service';
import { MatPaginator } from '@angular/material/paginator';


export interface PeriodicElement {
  name: any;
  feedername: any;
  parameter:any;
  condition: any;
  threshold :any;
  repeat:any;
  start_time:any;
  end_time:any;
  email:any;
  sms:any;
  alertname:any;
  actions:any;
  enabled:any;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {
  displayedColumns: string[] = ['name', 'feedername','parameter','condition','threshold','repeat','start_time','end_time','email','sms',
  'alertname','actions','enabled' ];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  constructor(public dashService: DashService, private service: DashboardService,public dialog: MatDialog) {}
  threshold:string = "mainpcc";


  ngOnInit(): void {
    this.getAlert();
    this.dashService.isPageLoading(true);
  }
  getAlert(){
    if(this.threshold){
      this.service.getalertdata(this.threshold).subscribe(
        (alert) =>{
          console.log(alert);
          this.dataSource = alert;
          
        },
        (error)=>{
            // console.log(error);
        }
      );
    }
  }

  openEditAlertsDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '80vw';

    const dialogRef = this.dialog.open(EditAlertsComponent, dialogConfig);
  }

}
