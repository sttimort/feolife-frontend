import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, merge, mergeMap, Observable } from 'rxjs';
import { clearAuthToken, setAuthenticated, setAuthToken, setUnauthenticated } from '../store/actions';
import { AuthTokenStorageService } from './auth-token-storage.service';
import { CreateUserProfileRequest, FeolifeApiClient } from './feolife-api-client';
import { UserProfileManager } from './user-profile-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  constructor(
    private apiClient: FeolifeApiClient,
    private userProfileManager: UserProfileManager,
    private authTokenStorageService: AuthTokenStorageService,
    private store: Store
  ) { }

  public checkInitialAuthentication() {
    let authToken = this.authTokenStorageService.get()
    if (authToken == null) {
      this.store.dispatch(setUnauthenticated())
      this.store.dispatch(clearAuthToken())
    } else {
      this.checkAuthenticated(authToken)
        .subscribe(() => {
          this.store.dispatch(setAuthToken({ authToken: authToken!! }));
          this.userProfileManager.fetchUserProfileInfo().subscribe();
        })
    }
  }

  public authenticate(username: string, password: string): Observable<void> {
    return this.apiClient
      .authenticate(username, password)
      .pipe(
        mergeMap(token => this.checkAuthenticated(token).pipe(map(() => token))),
        map(token => {
          this.authTokenStorageService.save(token);
          this.store.dispatch(setAuthToken({ authToken: token }));
        }),
        map(() => { this.userProfileManager.fetchUserProfileInfo().subscribe() }),
        catchError((error, _) => { throw new AuthenticationFailedError(error) }),
      );
  }

  public createUserProfile(request: CreateUserProfileRequest): Observable<void> {
    return this.apiClient
      .createUserProfile(request)
      .pipe(catchError((error, _) => { throw new UserProfileCreationError() }))
  }

  public logout() {
    this.authTokenStorageService.remove()
    this.store.dispatch(clearAuthToken())
    this.store.dispatch(setUnauthenticated())
  }

  private checkAuthenticated(token: string): Observable<any> {
    return this.apiClient
      .checkToken(token)
      .pipe(
        map(() => { this.store.dispatch(setAuthenticated()) }),
        catchError((error, _) => {
          this.store.dispatch(setUnauthenticated())
          throw error;
        })
      );
  }
}

export class AuthenticationFailedError {
  constructor(public cause: any) { }
}

export class UserProfileCreationError { }
