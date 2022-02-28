import { Component, OnInit } from '@angular/core';

import { catchError, map, mergeMap, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthManagerService } from './service/auth-manager.service';
import { MenuItem, PrimeIcons, PrimeNGConfig } from 'primeng/api';
import { FeolifeApiError, FeolifeApiErrorReason } from './service/api/feolife-api-client';
import { State } from './store/state';
import { initialAuthServerFailure, startInitialAuthCheck } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showWelcomeBox: Observable<boolean>

  showSpinner: boolean = false;
  showServerUnreachable: Observable<boolean>

  constructor(
    private primeNgConfig: PrimeNGConfig,
    private authManager: AuthManagerService,
    private store: Store<{ state: State }>,
  ) {
    this.showWelcomeBox = this.store.select(it => it.state.isAuthenticated).pipe(map(it => it != true))
    this.showServerUnreachable = this.store.select(it => it.state.initialAuthServerFailure === true)
  }

  ngOnInit(): void {
    this.primeNgConfig.ripple = true
    this.primeNgConfig.setTranslation({
      dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      dayNamesShort: ["Воск", "Понед", "Втор", "Сред", "Четв", "Пятн", "Субб"],
      dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      monthNames: [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
        "Сентябрь", "Октбярь", "Ноябрь", "Декабрь"
      ],
      monthNamesShort: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
      firstDayOfWeek: 1,
      dateFormat: 'dd.mm.yy',
    })
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
