import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/login/auth/auth.service';
import { DashService } from '../../dash.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit { 
  currentPageName: string = '';
  isFullScreen = false;
  elem = document.documentElement;
  isFullscreen = false;
  constructor(public dashService: DashService, public authService:  AuthService, private router: Router) 
  {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentPageName = this.getPageNameFromRoute(this.router.url);
      }
    });
  }

  currentTime: Date = new Date();

  ngOnInit(): void {
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
  logout(){
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
}
