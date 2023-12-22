import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';



@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  Name = new FormControl('', [Validators.required]);
  Id = new FormControl('', [Validators.required]);
  Designation = new FormControl('', [Validators.required]);
  Mobile = new FormControl('', [Validators.required]);
  Plants = new FormControl('', [Validators.required]);
  Privileges = new FormControl('', [Validators.required]);

  updateDetails() {
    if(this.Name.valid && this.Id.valid && this.Designation.valid && this.Mobile.valid && this.Plants.valid && this.Privileges.valid){
      const userData = {
        Name : this.Name.value,
        Id : this.Id.value,
        Designation : this.Designation.value,
        Mobile : this.Mobile.value,
        Plants : this.Plants.value,
        Privileges : this.Privileges.value
      }

      console.log(userData);
    }
  }
}
