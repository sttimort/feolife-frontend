import { EventEmitter,Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExtensibleUserProfile, FeolifeApiClient } from 'src/app/service/api/feolife-api-client';


@Component({
  selector: 'app-set-peasant',
  templateUrl: './set-peasant.component.html',
  styleUrls: ['./set-peasant.component.scss']
})

export class SetPeasantComponent implements OnInit {

  private fistNameFromControl = new FormControl('', [
    Validators.required, Validators.maxLength(128)
  ]);

  private secondNameFormControl = new FormControl('', [
    Validators.maxLength(128)
  ]);

  private lastNameFormControl = new FormControl('', [
    Validators.required, Validators.maxLength(128)
  ]);

  private bithDateFormControl = new FormControl('', [
   
  ]);

  private sexFormControl = new FormControl('', [
   
  ]);

  private placeBirthFormControl = new FormControl('', [
    Validators.maxLength(128)
  ]);

  private ownerFormControl = new FormControl('', [
    Validators.maxLength(128)
  ]);

  peasantForm = new FormGroup({
    firstName: this.fistNameFromControl,
    middleName: this.secondNameFormControl,
    lastName: this.lastNameFormControl,
    bithDate: this.bithDateFormControl,
    placeBirth: this.placeBirthFormControl,
    owner: this.ownerFormControl,
    sex:this.sexFormControl
  });

  showFirstNameInvalidMessage(): boolean {
    return this.fistNameFromControl.dirty && this.fistNameFromControl.errors != null
  }
  showLastNameInvalidMessage(): boolean {
    return this.lastNameFormControl.dirty && this.lastNameFormControl.errors != null
  }

  getNameErrorMessage(): string {
    const errors = this.peasantForm.errors
    if (errors?.['required']) {
      return 'Требуется значение';
    } else if (errors?.['maxlength']) {
      const maxLength = errors?.['maxlength'].requiredLength;
      return `Максимальная длинна ${maxLength}`;
    } else if (errors != null) {
      return 'Что то не так';
    } else {
      return '';
    }
  }
  constructor(private apiClient: FeolifeApiClient,) { }

  ngOnInit(): void {
   
  }
 
  onSubmit() {
    if (this.peasantForm.valid) {
      this.apiClient.createPeasantOwnershipClame({
        firstName: this.fistNameFromControl.value,
        middleName: this.secondNameFormControl.value,
        lastName: this.lastNameFormControl.value,
        bithDate: this.bithDateFormControl.value,
        placeBirth: this.placeBirthFormControl.value,
        owner: this.ownerFormControl.value,
        sex:this.sexFormControl.value
      }).subscribe();
    }
  }
}
