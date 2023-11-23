import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  register(registerData: { companyName: string | null; companyEmail: string | null; contact: string | null; location: string | null; firstName: string | null; lastName: string | null; personalEmail: string | null; designation: string | null; password: string | null; }) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
