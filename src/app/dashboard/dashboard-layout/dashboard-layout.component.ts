import { Component, HostListener } from '@angular/core';

interface SideBarToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {

  isSideNavCollapsed = false;
  screenWidth = 0;
  collapse = true;

  onToggleSideNav(data: SideBarToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  constructor() {
    this.screenWidth = window.innerWidth;
    this.toggleSideNav();
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    this.toggleSideNav();
  }

  toggleSideNav() {
    this.collapse = this.screenWidth < 518;
  }
}
