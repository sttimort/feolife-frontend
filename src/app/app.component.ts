import { Component, OnInit } from '@angular/core';

import { catchError, map, mergeMap, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthManagerService } from './service/auth-manager.service';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { SignInFormSubmitEvent } from './components/sign-in-form/sign-in-form.component';
import { UserProfileManager } from './service/user-profile-manager.service';
import { FeolifeApiError, FeolifeApiErrorReason } from './service/feolife-api-client';
import { State } from './store/state';
import { initialAuthServerFailure, startInitialAuthCheck } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showWelcomeBox: Observable<boolean>

  profileName: Observable<string>

  menuItems: MenuItem[] = [
    { label: 'Log out', icon: 'pi pi-sign-out', command: () => this.authManager.logout() },
  ]

  showSpinner: boolean = false;
  showServerUnreachable: Observable<boolean>

  constructor(
    private primeNgConfig: PrimeNGConfig,
    private authManager: AuthManagerService,
    private store: Store<{ state: State }>,
  ) {
    this.showWelcomeBox = this.store.select(it => it.state.isAuthenticated).pipe(map(it => it != true))
    this.profileName = store.select(it => it.state.profile)
      .pipe(map(profile => profile != null ? `${profile.firstName} ${profile.lastName}` : ''))

    this.showServerUnreachable = this.store.select(it => it.state.initialAuthServerFailure === true)
  }

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;
    this.checkAuth();
  }

  checkAuth() {
    this.showSpinner = true;
    this.store.dispatch(startInitialAuthCheck());
    this.authManager
      .checkInitialAuthentication()
      .subscribe({
        complete: () => { this.showSpinner = false },
        error: (error) => {
          this.showSpinner = false;
          const isUnknownError = (error as FeolifeApiError)?.reason == FeolifeApiErrorReason.OTHER
          if (isUnknownError) {
            this.store.dispatch(initialAuthServerFailure())
          }
        },
      });
  }
}
