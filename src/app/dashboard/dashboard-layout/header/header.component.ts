import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth/auth.service';
import { DashService } from '../../dash.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentPageName: string = '';
  isFullScreen = false;
  screenWidth = 0;
  collapse = true;
  currentTime: Date = new Date();

  constructor(public dashService: DashService, public authService: AuthService, private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentPageName = this.getPageNameFromRoute(this.router.url);
      }
    });
  }

  ngOnInit(): void {
    // Set initial screen width and call toggleSideNav to set collapse state
    this.screenWidth = window.innerWidth;
    this.toggleSideNav();

    // Update current time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  private getPageNameFromRoute(url: string): string {
    const segments = url.split('/');
    const formattedName = segments[segments.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return formattedName;
  }

  public toggleMenu() {
    this.dashService.toggleMenu();
  }

  logout() {
    this.authService.logout();
  }

  toggleFullScreen() {
    if (!this.isFullScreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        this.isFullScreen = true;
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.isFullScreen = false;
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    this.toggleSideNav();
  }

  toggleSideNav() {
    this.collapse = this.screenWidth < 518;
  }

  home() {
    this.router.navigate(['dashboard/overview']);
  }

  feeder() {
    this.router.navigate(['dashboard/feeder']);
  }

  analytics() {
    this.router.navigate(['dashboard/analytics']);
  }

  tools() {
    this.router.navigate(['dashboard/tools']);
  }

  report() {
    this.router.navigate(['dashboard/report']);
  }

  profile() {
    this.router.navigate(['dashboard/profile']);
  }

  todreport() {
    this.router.navigate(['dashboard/tod_report']);
  }
}
