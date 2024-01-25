import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private errorMessageSource = new BehaviorSubject<string>('');
  errorMessage$ = this.errorMessageSource.asObservable();

  setErrorMessage(errorMessage: string) {
    this.errorMessageSource.next(errorMessage);
  }

  private usertype!: string;
  private companyemail!: string;
  private token!: string;

  constructor(private http: HttpClient, private router: Router) {}

  private readonly API_URL = 'http://localhost:3000';

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginData);
  }

  registerCompany(registerData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register-company`, registerData);
  }

  registerUser(registerData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register-user`, registerData);
  }

  resendVerificationEmail(resendVerifyData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/re-verify-mail`, resendVerifyData);
  }

  VerifyUser(verifyUserToken: any): Observable<any> {
    return this.http.post(`${this.API_URL}/verify`, verifyUserToken);
  }

  forgot(forgotData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot`, forgotData);
  }

  resendForgot(resendForgotData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/resend-forgot`, resendForgotData);
  }

  resetPassword(resetData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, resetData);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  setUserType(usertype: string) {
    sessionStorage.setItem('usertype', usertype);
  }

  getUserType(): string | null {
    return sessionStorage.getItem('usertype');
  }

  setFirstName(firstname: string) {
    sessionStorage.setItem('firstname', firstname);
  }

  getFirstName(): string | null {
    return sessionStorage.getItem('firstname');
  }

  setLastname(lastname: string) {
    sessionStorage.setItem('lastname', lastname);
  }

  getLastName(): string | null {
    return sessionStorage.getItem('lastname');
  }

  setCompanyEmail(companyemail: string){
    sessionStorage.setItem('companyemail', companyemail);
  }

  getCompanyEmail(): string | null {
    return sessionStorage.getItem('companyemail');
  }

  setCompanyId(companyid: string){
    sessionStorage.setItem('companyid', companyid);
  }

  getCompanyId(): string | null {
    return sessionStorage.getItem('companyid');
  }

  setCompanyName(companyname: string){
    sessionStorage.setItem('companyname', companyname);
  }

  getCompanyName(): string | null {
    return sessionStorage.getItem('companyname');
  }

  setToken(token: string): void {
    this.token = token;
    sessionStorage.setItem('token', token); // Store the token in the session storage

    // Fetch user details immediately after setting the token
    this.getUserDetails();
  }

  getToken(): string | null {
    return this.token || sessionStorage.getItem('token'); // Retrieve the token from the session storage
  }

  logout(): void {
    sessionStorage.removeItem('token'); // Clear the token
    this.isLoggedIn(); // Set the logged-in status to false
    this.setUserType(''); // Clear the user type
    this.router.navigate(['/login/login']); // Additional cleanup or redirect logic can be added here
    window.location.reload();
  }

  getUserDetails(): void {
    const token = this.getToken();
    if (token && !this.usertype) {
      // Make a request to fetch user details using the token
      this.http.get(`${this.API_URL}/user`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe(
          (user: any) => {
            console.log(user)
            // Handle the response and set the user type
            const userType = user.getUserDetails.privileges;
            this.setUserType(userType);

            const companyid = user.getUserDetails.companyId;
            this.setCompanyId(companyid);

            const firstName = user.getUserDetails.firstName;
            this.setFirstName(firstName);

            const lastName = user.getUserDetails.lastName;
            this.setLastname(lastName);

            const companyEmail = user.companyDetails.companyEmail;
            this.setCompanyEmail(companyEmail);
            
            const companyName = user.companyDetails.companyName;
            this.setCompanyName(companyName);

            const userid = user.getUserDetails.userId;
            sessionStorage.setItem('userid', userid);
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/users`);
  }
}
