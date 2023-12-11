import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class DashService {

  

  public showMenu = false;
  public pageLoading = true;
  public dataLoading = true;
  
  public toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  public isDataLoading() {
    this.dataLoading = !this.dataLoading;
  }

  public isPageLoading(isLoading: boolean) {
    this.pageLoading = isLoading;
  }
 


}
