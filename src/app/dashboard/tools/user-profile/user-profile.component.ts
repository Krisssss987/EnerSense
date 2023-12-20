import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditUserComponent } from './edit-user/edit-user.component';
import { DashboardService } from '../../dash_service/dashboard.service';
import{ DashService } from '../../dash.service';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  user: any;
  name: any;
  userid: any;
  password:any;
  email: any;
  designation :any;
  mobile :any;
  plants:any;
  privileges:any;
  actions:any;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  displayedColumns: string[] = ['user','name', 'userid', 'password', 'email','designation','mobile','plants','privileges','actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  

  constructor(public dashService: DashService, private service: DashboardService,public dialog: MatDialog) {}
  userId:string = "123";
  

  
  ngOnInit(): void {
    this.getUser();
    this.dashService.isPageLoading(true);
  }
  getUser(){
    if(this.userId){
      this.service.getuserdata(this.userId).subscribe(
        (user) =>{
          console.log(user);
          this.dataSource = user;
        },
        (error)=>{
            console.log(error);
        }
      );
    }
  }
  


  openEditUserDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';

    const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);
  }
}


