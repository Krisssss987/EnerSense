import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { ToolsComponent } from './tools/tools.component';
import { OverviewComponent } from './overview/overview.component';
import { FeederComponent } from './feeder/feeder.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SummaryComponent } from './overview/summary/summary.component';
import { HeaderComponent } from './dashboard-layout/header/header.component';
import { FooterComponent } from './dashboard-layout/footer/footer.component';
import { SidebarComponent } from './dashboard-layout/sidebar/sidebar.component';
import { ContainerComponent } from './dashboard-layout/container/container.component';
import { HarmonicComponent } from './analytics/harmonic/harmonic.component';
import { QuickAnalysisComponent } from './analytics/quick-analysis/quick-analysis.component';
import { ConsuptionComponent } from './analytics/consuption/consuption.component';
import { ParamaterisedComponent } from './analytics/paramaterised/paramaterised.component';
import { ReportComponent } from './report/report.component';
import { FilterComponent } from './overview/filter/filter.component';
import { AddFeederComponent } from './tools/tools-component/add-feeder/add-feeder.component';
import { UpdateFeederComponent } from './tools/tools-component/update-feeder/update-feeder.component';
import { UpdateUserComponent } from './tools/tools-component/update-user/update-user.component';
import { AddUserComponent } from './tools/tools-component/add-user/add-user.component';
import { AddShiftComponent } from './tools/tools-component/add-shift/add-shift.component';
import { UpdateShiftComponent } from './tools/tools-component/update-shift/update-shift.component';
import { UpdateAlertComponent } from './tools/tools-component/update-alert/update-alert.component';
import { AddAlertComponent } from './tools/tools-component/add-alert/add-alert.component';
import { ProfileComponent } from './profile/profile.component';
import { TodReportComponent } from './tod-report/tod-report.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    ToolsComponent,
    OverviewComponent,
    FeederComponent,
    AnalyticsComponent,
    SummaryComponent,
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
    AddFeederComponent,
    UpdateFeederComponent,
    UpdateUserComponent,
    AddUserComponent,
    AddShiftComponent,
    UpdateShiftComponent,
    UpdateAlertComponent,
    AddAlertComponent,
    ProfileComponent,
    TodReportComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MaterialModule
  ],
  providers: [DatePipe],
})
export class DashboardModule {}
