import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PeasantOwnershipClaimService } from 'src/app/service/peasant-ownership-claim.service';

@Component({
  selector: 'app-set-peasant',
  templateUrl: './set-peasant.component.html',
  styleUrls: ['./set-peasant.component.scss']
})

export class SetPeasantComponent implements OnInit {

  private peasantFistNameFromControl = new FormControl('', [
    Validators.required, Validators.maxLength(128)
  ]);

  private peasantLastNameFormControl = new FormControl('', [
    Validators.required, Validators.maxLength(128)
  ]);

  private peasantMiddleNameFormControl = new FormControl('', [
    Validators.maxLength(128)
  ]);

  private peasantBithDateFormControl = new FormControl(null, []);

  private peasantGenderFormControl = new FormControl('', []);

  private peasantBirthPlaceFormControl = new FormControl('', [
    Validators.maxLength(128)
  ]);

  private ownershipGroundsFormControl = new FormControl('', []);

  peasantForm = new FormGroup({
    firstName: this.peasantFistNameFromControl,
    middleName: this.peasantMiddleNameFormControl,
    lastName: this.peasantLastNameFormControl,
    bithDate: this.peasantBithDateFormControl,
    placeBirth: this.peasantBirthPlaceFormControl,
    owner: this.ownershipGroundsFormControl,
    sex: this.peasantGenderFormControl
  });

  constructor(
    private peasantOwnershipClaimService: PeasantOwnershipClaimService,
  ) { }

  showFirstNameInvalidMessage(): boolean {
    return this.peasantFistNameFromControl.dirty && this.peasantFistNameFromControl.errors != null
  }
  showLastNameInvalidMessage(): boolean {
    return this.peasantLastNameFormControl.dirty && this.peasantLastNameFormControl.errors != null
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


  ngOnInit(): void {

  }

  onSubmit() {
    if (this.peasantForm.valid) {
      this.peasantOwnershipClaimService
        .initiatePeasantClaimCreation({
          peasantFirstName: this.peasantFistNameFromControl.value,
          peasantLastName: this.peasantLastNameFormControl.value,
          peasantMiddleName: this.peasantMiddleNameFormControl.value?.length > 0
            ? this.peasantMiddleNameFormControl.value
            : null,
          peasantBirthDate: this.peasantBithDateFormControl.value,
          peasantGender: this.peasantGenderFormControl.value,
          peasantBirthPlace: this.peasantBirthPlaceFormControl.value,
          ownershipGrounds: this.ownershipGroundsFormControl.value,
        })
        .subscribe()
    }
  }
}
