import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditFeederComponent } from './edit-feeder/edit-feeder.component';

export interface PeriodicElement {
  name: string;
  location: string;
  id: string;
  device: string;
  group: string;
  vgroup: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'PD1-CB1', location: 'Location', id: 'DI1001', device: 'DEVICE', group: 'S/Stn#4- SN Area', vgroup: '--' },
  { name: 'CB-2', location: 'Location', id: 'DI1002', device: 'DEVICE', group: 'S/Stn#4- SN Area', vgroup: '--' },
  { name: 'PD2(1)', location: 'Location', id: 'DI1003', device: 'DEVICE', group: 'S/Stn#4- SN Area', vgroup: '--' },
  { name: 'PD-6', location: 'Location', id: 'DI1004', device: 'DEVICE', group: 'S/Stn#4- SN Area', vgroup: 'Load on DG4_S/Stn1' },
  { name: 'PP LAB', location: 'Location', id: 'DI1005', device: 'DEVICE', group: 'S/Stn#4- SN Area', vgroup: 'Load on DG2_S/Stn1' },
  { name: 'PD-03', location: 'Location', id: 'DI1006', device: 'DEVICE', group: 'S/Stn#4- SN Area', vgroup: '--' },
 
];

@Component({
  selector: 'app-feeder-configuration',
  templateUrl: './feeder-configuration.component.html',
  styleUrls: ['./feeder-configuration.component.css']
})
export class FeederConfigurationComponent {
  displayedColumns: string[] = ['name', 'location', 'id', 'device', 'group', 'vgroup', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  openEditFeederDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';

    const dialogRef = this.dialog.open(EditFeederComponent, dialogConfig);
  }
}
