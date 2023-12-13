import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { ToolsComponent } from './tools/tools.component';
import { OverviewComponent } from './overview/overview.component';
import { FeederComponent } from './feeder/feeder.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCardModule} from '@angular/material/card'
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { SummaryComponent } from './overview/summary/summary.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { UserProfileComponent } from './tools/user-profile/user-profile.component';
import { FeederConfigurationComponent } from './tools/feeder-configuration/feeder-configuration.component';
import { AlertsComponent } from './tools/alerts/alerts.component';
import { DayShiftComponent } from './tools/day-shift/day-shift.component';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { EditFeederComponent } from './tools/feeder-configuration/edit-feeder/edit-feeder.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditUserComponent } from './tools/user-profile/edit-user/edit-user.component';
import { EditAlertsComponent } from './tools/alerts/edit-alerts/edit-alerts.component';
import { HeaderComponent } from './dashboard-layout/header/header.component';
import { FooterComponent } from './dashboard-layout/footer/footer.component';
import { SidebarComponent } from './dashboard-layout/sidebar/sidebar.component';
import { ContainerComponent } from './dashboard-layout/container/container.component';


import { MatSliderModule } from '@angular/material/slider';
import { HarmonicComponent } from './analytics/harmonic/harmonic.component';
import { QuickAnalysisComponent } from './analytics/quick-analysis/quick-analysis.component';
import { ConsuptionComponent } from './analytics/consuption/consuption.component';
import { ParamaterisedComponent } from './analytics/paramaterised/paramaterised.component';
import {MatChipsModule} from '@angular/material/chips';
import { ReportComponent } from './report/report.component';
import { FilterComponent } from './overview/filter/filter.component';



@NgModule({
  declarations: [
    DashboardLayoutComponent,
    ToolsComponent,
    OverviewComponent,
    FeederComponent,
    AnalyticsComponent,
    SummaryComponent,
    UserProfileComponent,
    FeederConfigurationComponent,
    AlertsComponent,
    DayShiftComponent,
    EditFeederComponent,
    EditUserComponent,
    EditAlertsComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContainerComponent,
    HarmonicComponent,
    QuickAnalysisComponent,
    ConsuptionComponent,
    ParamaterisedComponent,
    ReportComponent,
    FilterComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatDividerModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule ,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatCardModule,
    MatSliderModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,

    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ]
})
export class DashboardModule { }
