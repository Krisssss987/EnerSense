import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditFeederComponent } from './edit-feeder/edit-feeder.component';
import { DashboardService } from '../../dash_service/dashboard.service';
import{ DashService } from '../../dash.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  feeder_id: any;
  name: any;
  location: any;
  deviceuid:any;
  device: any;
  group_id:any;
  virtual_group_id:any;
  group_name:any;
  virtual_group_name:any;
  thresholdvalue:any;
  actions:any;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-feeder-configuration',
  templateUrl: './feeder-configuration.component.html',
  styleUrls: ['./feeder-configuration.component.css']
})
export class FeederConfigurationComponent {
  displayedColumns: string[] = ['feeder_id', 'name', 'location', 'deviceuid', 'device', 'group_id', 
  'virtual_group_id','group_name','virtual_group_name','thresholdvalue','actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  constructor(public dashService: DashService, private service: DashboardService,public dialog: MatDialog) {}
  fedder_Id:string = "123";
  

  
  ngOnInit(): void {
    this.getFeeder();
    this.dashService.isPageLoading(true);
  }
  getFeeder(){
    if(this.fedder_Id){
      this.service.getfeederdata(this.fedder_Id).subscribe(
        (feeder) =>{
          console.log(feeder);
          this.dataSource = feeder;
        },
        (error)=>{
            console.log(error);
        }
      );
    }
  }

  openEditFeederDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';

    const dialogRef = this.dialog.open(EditFeederComponent, dialogConfig);
  }
}
