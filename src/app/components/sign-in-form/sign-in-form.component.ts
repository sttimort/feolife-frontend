import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export declare type SignInFormSubmitEvent = {
  username: string,
  password: string,
};

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss']
})
export class SignInFormComponent implements OnInit {

  private usernameFormControl = new FormControl('', [
    Validators.required, Validators.maxLength(128)
  ]);

  private passwordFormControl = new FormControl('', [
    Validators.required, Validators.minLength(6), Validators.maxLength(128)
  ]);

  loginForm = new FormGroup({
    username: this.usernameFormControl,
    password: this.passwordFormControl,
  });

  @Output('signin-submit') submitEventEmitter = new EventEmitter<SignInFormSubmitEvent>();


  constructor() { }

  ngOnInit(): void {
  }

  showUsernameInvalidMessage(): boolean {
    return this.usernameFormControl.dirty && this.usernameFormControl.errors != null
  }

  getUsernameErrorMessage(): string {
    const errors = this.usernameFormControl.errors
    if (errors?.['required']) {
      return 'Username is required';
    } else if (errors?.['maxlength']) {
      const maxLength = errors?.['maxlength'].requiredLength;
      return `Username max length is ${maxLength}`;
    } else if (errors != null) {
      return 'Username is invalid';
    } else {
      return '';
    }
  }

  showPasswordInvalidMessage(): boolean {
    return this.passwordFormControl.dirty && this.passwordFormControl.errors != null
  }

  getPasswordErrorMessage(): string {
    const errors = this.passwordFormControl.errors
    if (errors?.['required']) {
      return 'Password is required';
    } else if (errors?.['minlength']) {
      const minLength = errors?.['minlength'].requiredLength;
      return `Password min length is ${minLength}`;
    } else if (errors?.['maxlength']) {
      const maxLength = errors?.['maxlength'].requiredLength;
      return `Password max length is ${maxLength}`;
    } else if (errors != null) {
      return 'Password is invalid';
    } else {
      return '';
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.submitEventEmitter.emit({
        username: this.usernameFormControl.value,
        password: this.passwordFormControl.value,
      });
    }
  }
}
