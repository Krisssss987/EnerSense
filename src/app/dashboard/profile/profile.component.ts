import { Component } from '@angular/core';
import { DashboardService } from '../dash_service/dashboard.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  fname:string='';
  lname:string='';
  companyName = new FormControl({ value: '', disabled: true },[Validators.required]);
  companyEmail = new FormControl({ value: '', disabled: true },[Validators.required]);
  companyLocation = new FormControl({ value: '', disabled: true },[Validators.required]);
  energy = new FormControl({ value: '', disabled: true },[Validators.required]);
  sanctionedKW = new FormControl({ value: '', disabled: true },[Validators.required]);
  connectedKW = new FormControl({ value: '', disabled: true },[Validators.required]);
  contractKVA = new FormControl({ value: '', disabled: true },[Validators.required]);
  tariff = new FormControl({ value: '', disabled: true },[Validators.required]);
  electricity = new FormControl({ value: '', disabled: true },[Validators.required]);
  firstName = new FormControl({ value: '', disabled: true },[Validators.required]);
  lastName = new FormControl({ value: '', disabled: true },[Validators.required]);
  personalEmail = new FormControl({ value: '', disabled: true },[Validators.required]);
  contact = new FormControl({ value: '', disabled: true },[Validators.required]);
  shift = new FormControl({ value: '', disabled: true },[Validators.required]);
  designation = new FormControl({ value: '', disabled: true },[Validators.required]);
  plant = new FormControl({ value: '', disabled: true },[Validators.required]);
  priviledges = new FormControl({ value: '', disabled: true },[Validators.required]);
  password = new FormControl({ value: '', disabled: true },[Validators.required]);
  confirmPassword = new FormControl({ value: '', disabled: true },[Validators.required]);
  percent_demand = new FormControl({ value: '', disabled: true });
  energy_detail = new FormControl({ value: '', disabled: true });
  energy_value = new FormControl({ value: '', disabled: true });
  subscriptions: Subscription[] = [];

  userType=sessionStorage.getItem('usertype');
  shiftData: any;

  constructor(
    public DashDataService: DashboardService,
    public authService: AuthService,
    public snackBar: MatSnackBar,
  ){}


  ngOnInit(): void {
    this.getUserDetails();
    this.getShift();
  }

  ngOnDestroy(){
    this.unsubscribeFromTopics();
  }
  
  unsubscribeFromTopics() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  userId!: string | null;
  hidePassword = true;
  hideConfirmPassword = true;
  cancelCompany: boolean = false;
  cancelPersonal: boolean = false;
  cancelPassword: boolean = false;
  userData:any;

  toggleCompany(){
    this.cancelCompany = !this.cancelCompany;
    this.companyLocation.disabled ? this.companyLocation.enable() : this.companyLocation.disable();
    this.energy.disabled ? this.energy.enable() : this.energy.disable();
    this.sanctionedKW.disabled ? this.sanctionedKW.enable() : this.sanctionedKW.disable();
    this.connectedKW.disabled ? this.connectedKW.enable() : this.connectedKW.disable();
    this.contractKVA.disabled ? this.contractKVA.enable() : this.contractKVA.disable();
    this.tariff.disabled ? this.tariff.enable() : this.tariff.disable();
    this.electricity.disabled ? this.electricity.enable() : this.electricity.disable();
    this.percent_demand.disabled ? this.percent_demand.enable() : this.percent_demand.disable();
    this.energy_detail.disabled ? this.energy_detail.enable() : this.energy_detail.disable();
    this.energy_value.disabled ? this.energy_value.enable() : this.energy_value.disable();
  }

  togglePersonal(){
    this.cancelPersonal = !this.cancelPersonal;
    this.firstName.disabled ? this.firstName.enable() : this.firstName.disable();
    this.lastName.disabled ? this.lastName.enable() : this.lastName.disable();
    this.contact.disabled ? this.contact.enable() : this.contact.disable();

    if(this.userType=='Admin'){
      this.personalEmail.disabled ? this.personalEmail.enable() : this.personalEmail.disable();
      this.shift.disabled ? this.shift.enable() : this.shift.disable();
      this.designation.disabled ? this.designation.enable() : this.designation.disable();
      this.plant.disabled ? this.plant.enable() : this.plant.disable();
      this.priviledges.disabled ? this.priviledges.enable() : this.priviledges.disable();
    }
  }

  togglePassword(){
    this.cancelPassword = !this.cancelPassword;
    this.password.disabled ? this.password.enable() : this.password.disable();
    this.confirmPassword.disabled ? this.confirmPassword.enable() : this.confirmPassword.disable();
  }

  getUserDetails() {
    this.userId = sessionStorage.getItem('userid');
    if (this.userId) {
      const subscription = this.DashDataService.getUserById(this.userId).subscribe(
        (user: any) => {
          this.userData=user.getUserById[0];
          this.fname=this.userData.firstName;
          this.lname=this.userData.lastName;
          this.companyName = new FormControl({ value: this.userData.companyName, disabled: true },[Validators.required]);
          this.companyEmail = new FormControl({ value: this.userData.companyEmail, disabled: true },[Validators.required]);
          this.companyLocation = new FormControl({ value: this.userData.companyLocation, disabled: true },[Validators.required]);
          this.energy = new FormControl({ value: this.userData.energyConsumptionLtHt, disabled: true },[Validators.required]);
          this.sanctionedKW = new FormControl({ value: this.userData.sanctionedLoadKw, disabled: true },[Validators.required]);
          this.connectedKW = new FormControl({ value: this.userData.connectedLoadKw, disabled: true },[Validators.required]);
          this.contractKVA = new FormControl({ value: this.userData.contractDemandKva, disabled: true },[Validators.required]);
          this.tariff = new FormControl({ value: this.userData.tariff, disabled: true },[Validators.required]);
          this.electricity = new FormControl({ value: this.userData.electricityBill, disabled: true },[Validators.required]);
          this.firstName = new FormControl({ value: this.userData.firstName, disabled: true },[Validators.required]);
          this.lastName = new FormControl({ value: this.userData.lastName, disabled: true },[Validators.required]);
          this.personalEmail = new FormControl({ value: this.userData.personalEmail, disabled: true },[Validators.required]);
          this.contact = new FormControl({ value: this.userData.contactNo, disabled: true },[Validators.required]);
          this.shift = new FormControl({ value: this.userData.shift, disabled: true },[Validators.required]);
          this.designation = new FormControl({ value: this.userData.designation, disabled: true },[Validators.required]);
          this.plant = new FormControl({ value: this.userData.plant, disabled: true },[Validators.required]);
          this.priviledges = new FormControl({ value: this.userData.privileges, disabled: true },[Validators.required]);
          this.percent_demand = new FormControl({ value: this.userData.percentContractDemand, disabled: true });
          this.energy_detail = new FormControl({ value: this.userData.energyDetail, disabled: true });
          this.energy_value = new FormControl({ value: this.userData.energyValue, disabled: true });
        },
        (error) => {
          this.snackBar.open('Error while fetching user Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
      this.subscriptions.push(subscription)
    }
  }

  getShift() {
    const CompanyId = this.authService.getCompanyId();
    if (CompanyId) {
      const subscription = this.DashDataService.shiftDetails(CompanyId).subscribe(
        (shift: any) => {
          this.shiftData = shift.getDay_Shift;
        },
        (error) => {
          this.snackBar.open('Error while fetching Shifts Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
      this.subscriptions.push(subscription)
    }
  }

  updateCompany()
  {
    if(this.companyLocation.valid && this.energy.valid && this.sanctionedKW.valid && this.contractKVA.valid && this.connectedKW.valid && this.tariff.valid)
    {
      const companyId = sessionStorage.getItem('companyid');

      const companyData = {
        companyName:this.companyName.value, 
        companyEmail:this.companyEmail.value, 
        companyLocation:this.companyLocation.value, 
        energyConsumerLtHt:this.energy.value, 
        sanctionedLoadKw:this.sanctionedKW.value, 
        contractDemandKva:this.contractKVA.value, 
        connectedLoadKw:this.connectedKW.value, 
        tariff:this.tariff.value, 
        electricityBill:this.electricity.value,
        percentContractDemand:this.percent_demand.value,  
        energyDetail:this.energy_detail.value, 
        energyValue:this.energy_value.value
      }

      this.DashDataService.updateCompany(companyId!,companyData).subscribe(
        (response) => {
          this.snackBar.open(
            'Company data Updated Successfully.',
            'Dismiss',
            { duration: 2000 }
          );
          this.toggleCompany();
          this.getUserDetails();
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Failed!. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      );

    }else{
      this.snackBar.open('Error sending Company Data!', 'Dismiss', {
        duration: 2000
      });
    } 
  }

  updatePersonal(){
    if(this.firstName.valid && this.lastName.valid && this.contact.valid && this.shift.valid && this.personalEmail.valid && this.designation.valid && this.plant.valid && this.priviledges.valid)
    {
      const personalEmail = this.personalEmail.value;

      const adminData = {
        userName:this.personalEmail.value,
        firstName:this.firstName.value, 
        lastName:this.lastName.value,
        contactNo:this.contact.value, 
        shift:this.shift.value, 
        designation:this.designation.value,  
        plant:this.plant.value, 
        privileges:this.priviledges.value
      }

      this.DashDataService.userUpdate(personalEmail!,adminData).subscribe(
        (response) => {
          this.snackBar.open(
            'User data Updated Successfully.',
            'Dismiss',
            { duration: 2000 }
          );
          this.togglePersonal();
          this.getUserDetails();
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Failed!. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      );

    }else{
      this.snackBar.open('Error sending Users Data!', 'Dismiss', {
        duration: 2000
      });
    }    
  }

  updatePassword(){
    if (this.password.value != this.confirmPassword.value) {
      this.snackBar.open('Passwords do not match!', 'Dismiss', {
        duration: 2000
        });
    }else if(this.password.valid && this.confirmPassword.valid && (this.password.value == this.confirmPassword.value)){
      const personalEmail = this.personalEmail.value;

      const Data = {
        password:this.password.value
      }

      this.DashDataService.updatePassword(personalEmail!,Data).subscribe(
        (response) => {
          this.snackBar.open(
            'Password Updated Successfully.',
            'Dismiss',
            { duration: 2000 }
          );
          this.togglePassword();
          this.password.reset();
          this.confirmPassword.reset();
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Failed!. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      );
    }
  }
}
