import { Component } from '@angular/core';
import { DashboardService } from '../dash_service/dashboard.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  
  fname=sessionStorage.getItem('firstname')
  lname=sessionStorage.getItem('lastname')

  constructor(
    public DashDataService: DashboardService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
  ){}

  companyEmail!: string;
  personalEmail!: string;
  companyName!: string;
  location!: string;
  designation!: string;
  contactNo!: string ;
  password: string = '';
  CPassword: string = ''; 
  hidePassword = true;
  hideConfirmPassword = true;
  userId!: string | null;
  cancelCompany: boolean = false;
  cancelPersonal: boolean = false;
  cancelPassword: boolean = false;

  toggleCompany(){
    this.cancelCompany = !this.cancelCompany;
  }

  togglePersonal(){
    this.cancelPersonal = !this.cancelPersonal;
  }

  togglePassword(){
    this.cancelPassword = !this.cancelPassword;
  }

  updateCompany(){

  }

  updatePersonal(){

  }

  updatePassword(){
    
    if (this.password !== this.CPassword) {
      this.snackBar.open('Passwords do not match!', 'Dismiss', {
        duration: 2000
        });
      return;
    }
  }
  

}
