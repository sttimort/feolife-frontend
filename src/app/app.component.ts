import { Component, OnInit } from '@angular/core';

import { map, mergeMap, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthManagerService } from './service/auth-manager.service';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { SignInFormSubmitEvent } from './components/sign-in-form/sign-in-form.component';
import { State } from './store/reducer';
import { UserProfileManager } from './service/user-profile-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showWelcomeBox: Observable<boolean>
  showSpinner: Observable<boolean>

  profileName: Observable<string>

  menuItems: MenuItem[] = [
    { label: 'Log out', icon: 'pi pi-sign-out', command: () => this.authManager.logout() }
  ]

  constructor(
    private primeNgConfig: PrimeNGConfig,
    private authManager: AuthManagerService,
    private store: Store<{ state: State }>,
  ) {
    this.showWelcomeBox = this.store.select(it => it.state.isAuthenticated).pipe(map(it => it != true))
    this.showSpinner = store.select(it => it.state.isAuthenticated).pipe(map((it) => it === null))
    this.profileName = store.select(it => it.state.profile)
      .pipe(map(profile => profile != null ? `${profile.firstName} ${profile.lastName}` : ''))
  }

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;
    this.authManager.checkInitialAuthentication()
  }
}
