import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent  {
  value!: string;

  tabChanged(event: MatTabChangeEvent) {
    this.value = event.index.toString();
    sessionStorage.setItem('analyticsTabIndex', this.value);
  }

  ngOnInit(): void {
    const storedValue = sessionStorage.getItem('analyticsTabIndex');
    if (storedValue !== null) {
      this.value = storedValue;
    } else {
      this.value = '0';
    }
  }  
}
