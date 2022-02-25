import { Injectable, Type } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { iif, map, Observable, of } from 'rxjs';
import { AuthManagerService } from '../service/auth-manager.service';
import { Permission, State } from '../store/state';

@Injectable({
  providedIn: 'root'
})
export class HasPermissionGuard implements CanActivate {

  constructor(
    private authManager: AuthManagerService,
    private store: Store<{ state: State }>
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredPermissions = route.data['requiredPermissions'] as Permission[]
    return iif(
      () => requiredPermissions ? true : false,
      this.store.select(it => it.state.profile?.permissions ?? []).pipe(
        map(permissions => {
          const allowed = requiredPermissions.every(it => permissions.includes(it));
          if (!allowed) {
            this.authManager.onSuccessAuthRedirectTo(state.url);
          }
          return allowed;
        })
      ),
      of(true),
    )
  }

}
