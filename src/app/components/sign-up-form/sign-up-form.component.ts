import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidationHelper } from 'src/app/service/form-validation-helper.service';

export interface SignUpSubmitEvent {
  username: string,
  password: string,
  firstname: string,
  lastname: string,
  middlename: string | null,
}

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent implements OnInit {

  @Output('signup-submit') submitEventEmitter = new EventEmitter<SignUpSubmitEvent>();

  usernameFormControl = new FormControl('', [
    Validators.required, Validators.maxLength(128)
  ])

  passwordFormControl = new FormControl('', [
    Validators.required, Validators.minLength(6), Validators.maxLength(128)
  ])

  firstnameFormControl = new FormControl('', [
    Validators.required, Validators.maxLength(128)
  ])

  lastnameFormControl = new FormControl('', [
    Validators.required, Validators.maxLength(128)
  ])

  middlenameFormControl = new FormControl('', [
    Validators.maxLength(128)
  ])

  signupForm = new FormGroup({
    username: this.usernameFormControl,
    password: this.passwordFormControl,
    firstname: this.firstnameFormControl,
    lastname: this.lastnameFormControl,
    middlename: this.middlenameFormControl,
  })

  constructor(
    private formValidationHelper: FormValidationHelper,
  ) { }

  ngOnInit(): void {
  }

  showInvalidMessage(control: FormControl): boolean {
    return this.formValidationHelper.shouldShowError(control);
  }
  
  getUsernameErrorMessage(): string {
    return this.formValidationHelper.getErrorMessage(this.usernameFormControl, 'Username');
  }

  getErrorMessage(control: FormControl, fieldName: string): string {
    return this.formValidationHelper.getErrorMessage(control, fieldName);
  }

  onSubmit() {
    this.submitEventEmitter.emit({
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
      firstname: this.firstnameFormControl.value,
      lastname: this.lastnameFormControl.value,
      middlename: this.middlenameFormControl.value?.length > 0 ? this.middlenameFormControl.value : null,
    })
  }
}
