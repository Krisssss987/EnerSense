import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditAlertsComponent } from './edit-alerts/edit-alerts.component';

export interface PeriodicElement {
  name: string;
  feeder: string;
  parameter:string;
  condition: string;
  threshold :string;
  repeat:string;
  start:string;
  end:string;
  email:string;
  sms:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'high S/Stn 1', feeder:'Main PCC',parameter:'AVG_AMP',condition:'>', threshold:'2400.000',
   repeat:'15 Min' ,start:'00:00', end:'23:59', email:'xyz@gmail.com', sms:'---'},
   { name: 'high S/Stn 1', feeder:'Main PCC',parameter:'AVG_AMP',condition:'>', threshold:'2400.000',
   repeat:'15 Min' ,start:'00:00', end:'23:59', email:'xyz@gmail.com', sms:'---'},
   { name: 'high  S/Stn 1', feeder:'Main PCC',parameter:'AVG_AMP',condition:'>', threshold:'2400.000',
   repeat:'15 Min' ,start:'00:00', end:'23:59', email:'xyz@gmail.com', sms:'---'},
   { name: 'high  S/Stn 1', feeder:'Main PCC',parameter:'AVG_AMP',condition:'>', threshold:'2400.000',
   repeat:'15 Min' ,start:'00:00', end:'23:59', email:'xyz@gmail.com', sms:'---'},
  
  
];

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {
  displayedColumns: string[] = ['name', 'feeder','parameter','condition','threshold','repeat','start','end','email','sms',
  'actions','enabled' ];
  dataSource = ELEMENT_DATA;


  constructor(public dialog: MatDialog) {}

  openEditAlertsDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '80vw';

    const dialogRef = this.dialog.open(EditAlertsComponent, dialogConfig);
  }

}
