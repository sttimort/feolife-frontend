import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FillUpsTookitComponent } from './components/fill-ups-tookit/fill-ups-tookit.component';
import { RolesManagementComponent } from './components/roles-management/roles-management.component';
import { HasPermissionGuard } from './guards/has-permission.guard';
import { Permission } from './store/state';

const routes: Routes = [
  { path: 'fill-ups', component: FillUpsTookitComponent },
  { path: 'roles', component: RolesManagementComponent, data: { requiredPermission: Permission.LIST_ROLES }, canActivate: [HasPermissionGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
