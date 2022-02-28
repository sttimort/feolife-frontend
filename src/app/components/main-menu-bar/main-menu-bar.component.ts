import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { AuthManagerService } from 'src/app/service/auth-manager.service';
import { Permission, State } from 'src/app/store/state';

@Component({
  selector: 'app-main-menu-bar',
  templateUrl: './main-menu-bar.component.html',
  styleUrls: ['./main-menu-bar.component.scss']
})
export class MainMenuBarComponent implements OnInit {

  profileName: Observable<string>

  menuBarItems: MenuItem[] = [];

  profileMenuItems: MenuItem[] = [
    { label: 'Log out', icon: 'pi pi-sign-out', command: () => this.authManager.logout() },
  ];

  private menuBarItemsWithPermissions: MenuItemWithPermission[] = [
    {
      label: 'Администрирование',
      icon: PrimeIcons.SERVER,
      items: [
        {
          label: 'Роли',
          icon: PrimeIcons.BAN,
          items: [
            {
              label: 'Управление ролями',
              icon: PrimeIcons.LIST,
              command: () => this.router.navigateByUrl('/roles'),
              requiredPermissions: [Permission.LIST_ROLES],
            },
            {
              label: 'Назначение ролей',
              icon: PrimeIcons.USER_EDIT,
              command: () => this.router.navigateByUrl('/role-assignments'),
              requiredPermissions: [Permission.LIST_ROLES, Permission.ASSIGN_ROLES],
            }
          ]
        }
      ]
    },
    {
      label: 'Финансы',
      icon: PrimeIcons.MONEY_BILL,
      items: [
        {
          label: 'Пополнение счетов',
          icon: PrimeIcons.PLUS_CIRCLE,
          command: () => this.router.navigateByUrl('/fill-ups'),
          requiredPermissions: [Permission.QUERY_BILLING_ACCOUNT, Permission.BILLING_ACCOUNT_FILL_UP],
        }
      ]
    },
    {
      label: 'Регистрация',
      icon: PrimeIcons.USER_PLUS,
      items: [
        {
          label: 'Добавить крестьянина',
          icon: PrimeIcons.PLUS_CIRCLE,
          command: () => this.router.navigateByUrl('/peasant'),
          //requiredPermissions: [Permission.QUERY_BILLING_ACCOUNT, Permission.BILLING_ACCOUNT_FILL_UP],
        },
        {
          label: 'Добавить крестьянина',
          icon: PrimeIcons.PLUS_CIRCLE,
          command: () => this.router.navigateByUrl('/peasant-approve'),
          //requiredPermissions: [Permission.QUERY_BILLING_ACCOUNT, Permission.BILLING_ACCOUNT_FILL_UP],
        }
      ]
    },
  ];

  constructor(
    private authManager: AuthManagerService,
    private router: Router,
    private store: Store<{ state: State }>,
  ) {
    this.profileName = store.select(it => it.state.profile).pipe(
      map(profile => profile != null ? `${profile.firstName} ${profile.lastName}` : ''),
    );

    this.store.select(it => it.state.profile).subscribe(profileOrNull => {
      this.menuBarItems = [];
      if (profileOrNull == null) {
        return;
      }

      const profile = profileOrNull!!
      console.log('profile', profile)

      const t = { items: this.menuBarItems };
      const history: { targetItems: MenuItemWithPermission[], sourceItems: MenuItemWithPermission[], index: number }[] = [
        {
          targetItems: [t],
          sourceItems: [{ items: this.menuBarItemsWithPermissions }],
          index: 1,
        }
      ];
      let currentTargetItems: MenuItemWithPermission[] = this.menuBarItems;
      let currentSourceItems: MenuItemWithPermission[] = this.menuBarItemsWithPermissions;

      let i = 0;
      while (i < currentSourceItems.length || history.length > 0) {
        if (i < currentSourceItems.length) {
          const currentSourceItem = currentSourceItems[i++];
          if (
            !currentSourceItem.requiredPermissions ||
            currentSourceItem.requiredPermissions.every(it => profile.permissions.includes(it))
          ) {
            const newTargetItem = { ...currentSourceItem, items: currentSourceItem.items ? [] : undefined };
            currentTargetItems.push(newTargetItem);
            if (currentSourceItem.items && currentSourceItem.items.length > 0) {
              history.push({
                sourceItems: currentSourceItems,
                targetItems: currentTargetItems,
                index: i,
              });
              currentTargetItems = newTargetItem.items!!;
              currentSourceItems = currentSourceItem.items;
              i = 0;
            }
          }
        }
        if (i >= currentSourceItems.length && history.length > 0) {
          const prevState = history.pop()!!;
          i = prevState.index;
          currentSourceItems = prevState.sourceItems;
          currentTargetItems = prevState.targetItems;
          const lastParent = currentTargetItems[i - 1]
          if (lastParent.items && lastParent.items.length > 0) {
            for (let ii = 0; ii < lastParent.items.length; ii++) {
              if (lastParent.items[ii].items && lastParent.items[ii].items!!.length < 1) {
                lastParent.items.splice(ii--, 1);
              }
            }
          }
        }
      }
      this.menuBarItems = t.items;
    });

  }

  ngOnInit(): void {
  }

}

interface MenuItemWithPermission extends MenuItem {
  requiredPermissions?: Permission[],
  items?: MenuItemWithPermission[]
}