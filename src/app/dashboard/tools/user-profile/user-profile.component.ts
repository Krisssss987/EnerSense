import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditUserComponent } from './edit-user/edit-user.component';

export interface PeriodicElement {
  name: string;
  id: string;
  password:string;
  email: string;
  designation :string;
  mobile :number;
  plants:string;
  privileges:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'admin', id:'admin', password:'xyz', email:'xyz23@gmail.com', designation:'manager', mobile:123456789, 
plants:'solar', privileges:'privilage-1' },
  
];


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  displayedColumns: string[] = ['user','name', 'id', 'password', 'email','designation','mobile','plants','privileges','actions'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  openEditUserDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';

    const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);
  }
}
