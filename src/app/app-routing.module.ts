import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FillUpsTookitComponent } from './components/fill-ups-tookit/fill-ups-tookit.component';
import { RoleAssignmentToolkitComponent } from './components/role-assignment-toolkit/role-assignment-toolkit.component';
import { RolesManagementComponent } from './components/roles-management/roles-management.component';
import { HasPermissionGuard } from './guards/has-permission.guard';
import { Permission } from './store/state';

const routes: Routes = [
  {
    path: 'fill-ups',
    component: FillUpsTookitComponent,
    data: { requiredPermissions: [Permission.QUERY_BILLING_ACCOUNT, Permission.BILLING_ACCOUNT_FILL_UP] },
    canActivate: [HasPermissionGuard],
  },
  {
    path: 'roles',
    component: RolesManagementComponent,
    data: { requiredPermissions: [Permission.LIST_ROLES] },
    canActivate: [HasPermissionGuard],
  },
  {
    path: 'role-assignments',
    component: RoleAssignmentToolkitComponent,
    data: { requiredPermissions: [Permission.LIST_ROLES, Permission.ASSIGN_ROLES] },
    canActivate: [HasPermissionGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
