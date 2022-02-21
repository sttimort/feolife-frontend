import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, filter, iif, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { clearAuthToken, setAuthenticated, setAuthToken, setUnauthenticated } from '../store/actions';
import { AuthTokenStorageService } from './auth-token-storage.service';
import { CreateUserProfileRequest, FeolifeApiClient, FeolifeApiError, FeolifeApiErrorReason } from './api/feolife-api-client';
import { UserProfileManager } from './user-profile-manager.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  private urlToRedirectToOnSuccessAuth: string | null = null;

  constructor(
    private router: Router,
    private apiClient: FeolifeApiClient,
    private userProfileManager: UserProfileManager,
    private authTokenStorageService: AuthTokenStorageService,
    private store: Store
  ) { }

  public onSuccessAuthRedirectTo(url: string) {
    this.urlToRedirectToOnSuccessAuth = url;
  }

  public checkInitialAuthentication(): Observable<void> {
    return of(this.authTokenStorageService.get()).pipe(
      filter((token, _: number) => {
        if (token == null) {
          this.store.dispatch(setUnauthenticated())
          this.store.dispatch(clearAuthToken())
        }
        return token != null;
      }),
      map(token => token!!),
      mergeMap(token => this.checkAuthenticated(token!!).pipe(map(() => token))),
      map(token => this.store.dispatch(setAuthToken({ authToken: token }))),
      mergeMap(() => this.userProfileManager.fetchUserProfileInfo()),
      map(() => {
        if (this.urlToRedirectToOnSuccessAuth != null) {
          this.router.navigateByUrl(this.urlToRedirectToOnSuccessAuth);
          this.urlToRedirectToOnSuccessAuth = null;
        }
      })
    )
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
        catchError((error, _) => {
          let reason = AuthenticationFailureReason.UNKNOWN;
          if ((error as FeolifeApiError)?.reason == FeolifeApiErrorReason.API_UNAUTHENTICATED) {
            reason = AuthenticationFailureReason.IVALID_CREDENTIALS;
          }

          throw new AuthenticationFailedError(reason, error);
        }),
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
          const reason = (error as FeolifeApiError)?.reason
          if (reason == FeolifeApiErrorReason.API_UNAUTHENTICATED) {
            this.store.dispatch(setUnauthenticated())
            this.store.dispatch(clearAuthToken())
          }
          throw error;
        })
      );
  }
}

export class AuthenticationFailedError {
  constructor(
    public reason: AuthenticationFailureReason,
    public cause: any,
  ) { }
}

export enum AuthenticationFailureReason {
  IVALID_CREDENTIALS, UNKNOWN
}

export class UserProfileCreationError { }
