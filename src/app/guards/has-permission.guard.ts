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
    const requiredPermission = route.data['requiredPermission'] as Permission
    return iif(
      () => requiredPermission ? true : false,
      this.store.select(it => it.state.profile?.permissions ?? []).pipe(
        map(permissions => {
          const allowed = permissions.includes(requiredPermission);
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
