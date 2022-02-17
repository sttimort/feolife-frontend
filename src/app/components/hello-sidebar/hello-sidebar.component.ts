import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, Observable } from 'rxjs';
import { AuthenticationFailedError, AuthenticationFailureReason, AuthManagerService } from 'src/app/service/auth-manager.service';
import { State } from 'src/app/store/reducer';
import { SignInFormSubmitEvent } from '../sign-in-form/sign-in-form.component';
import { SignUpSubmitEvent } from '../sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-hello-sidebar',
  templateUrl: './hello-sidebar.component.html',
  styleUrls: ['./hello-sidebar.component.scss']
})
export class HelloSidebarComponent implements OnInit {
  activeIndex: number = 0
  showOverlay: Observable<boolean>;

  signInFormError: string | null = null;
  signUpFormError: string | null = null;

  constructor(
    store: Store<{ state: State }>,

    private authManager: AuthManagerService,
  ) {
    this.showOverlay = store.select(it => it.state.isAuthenticated).pipe(map((it) => it === false))
  }

  ngOnInit(): void {
  }

  onSignInFormSubmit(event: SignInFormSubmitEvent) {
    this.clearSignInFormError();
    this.authManager
      .authenticate(event.username, event.password)
      .pipe(catchError((error, _) => {
        const errorReason = (error as AuthenticationFailedError)?.reason
        if (errorReason == AuthenticationFailureReason.IVALID_CREDENTIALS) {
          this.setSignInFormErrorMessageInvalidCredentials();
        } else {
          this.setSignInFormErrorMessageUnknownFailure();
        }
        throw error;
      }))
      .subscribe();
  }

  onSignupSubmit(event: SignUpSubmitEvent) {
    this.clearSignUpFormError();
    this.authManager
      .createUserProfile({
        username: event.username,
        password: event.password,
        firstName: event.firstname,
        lastName: event.lastname,
        middleName: event.middlename,
      })
      .pipe(
        catchError((error, _) => {
          this.setSignUpFormErrorMessageProfileCreationFailure();
          throw error;
        }),
        mergeMap(() => this.authManager
          .authenticate(event.username, event.password)
          .pipe(catchError((error, _) => {
            this.setSignInFormErrorMessageFailureAfterProfileCreation();
            this.activeIndex = 0;
            throw error;
          })),
        )
      )
      .subscribe();
  }

  private clearSignInFormError() {
    this.signInFormError = null;
  }

  private clearSignUpFormError() {
    this.signInFormError = null;
  }

  private setSignInFormErrorMessageInvalidCredentials() {
    this.signInFormError = "Неверное имя пользователя или пароль";
  }

  private setSignInFormErrorMessageUnknownFailure() {
    this.signInFormError = "Не удалось авторизоваться";
  }

  private setSignInFormErrorMessageFailureAfterProfileCreation() {
    this.signInFormError = "Не удалось авторизоваться после успешного создания профиля. Попробуйте авторизоваться заново";
  }

  private setSignUpFormErrorMessageProfileCreationFailure() {
    this.signUpFormError = "Произошла ошибка при создании профиля"
  }
}