import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, Observable } from 'rxjs';
import { AuthManagerService } from 'src/app/service/auth-manager.service';
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
  showInvalidUsernameOrPasswordMessage: boolean = false;
  showProfileCreationFailedMessage: boolean = false;
  showAuthFailedAfterProfileCreationMessage: boolean = false;

  constructor(
    store: Store<{ state: State }>,

    private authManager: AuthManagerService,
  ) {
    this.showOverlay = store.select(it => it.state.isAuthenticated).pipe(map((it) => it === false))
  }

  ngOnInit(): void {
  }

  onLogin(event: SignInFormSubmitEvent) {
    this.showInvalidUsernameOrPasswordMessage = false;
    this.authManager.authenticate(event.username, event.password)
      .pipe(catchError((err, _) => {
        this.showInvalidUsernameOrPasswordMessage = true;
        throw err;
      }))
      .subscribe(() => { this.showInvalidUsernameOrPasswordMessage = false; });
  }

  onSignupSubmit(event: SignUpSubmitEvent) {
    this.showProfileCreationFailedMessage = false;
    this.showAuthFailedAfterProfileCreationMessage = false;
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
          this.showProfileCreationFailedMessage = true;
          throw error;
        }),
        mergeMap(() => this.authManager
          .authenticate(event.username, event.password)
          .pipe(catchError((error, _) => {
            this.showAuthFailedAfterProfileCreationMessage = true;
            this.activeIndex = 0;
            throw error;
          })),
        )
      )
      .subscribe();
  }
}