import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  shift: string;
  name: string;
  start:string;
  end: string;
  grace: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { shift: 'FIR', name:'First',start:'10:00 AM',end:'7:00 PM', grace:10},
  { shift: 'FIR', name:'First',start:'10:00 AM',end:'7:00 PM', grace:10},
  { shift: 'FIR', name:'First',start:'10:00 AM',end:'7:00 PM', grace:10},
  { shift: 'FIR', name:'First',start:'10:00 AM',end:'7:00 PM', grace:10},
  { shift: 'FIR', name:'First',start:'10:00 AM',end:'7:00 PM', grace:10},
 
  
];
@Component({
  selector: 'app-day-shift',
  templateUrl: './day-shift.component.html',
  styleUrls: ['./day-shift.component.css']
})
export class DayShiftComponent {
  displayedColumns: string[] = ['shift', 'name', 'start', 'end','grace','actions'];
  dataSource = ELEMENT_DATA;
}
