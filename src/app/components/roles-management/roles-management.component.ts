import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataView } from 'primeng/dataview';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { FeolifeApiClient, Role } from 'src/app/service/api/feolife-api-client';
import { Permission } from 'src/app/store/state';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesManagementComponent implements OnInit {

  @ViewChild("rolesDataView")
  rolesDataViewComponent!: DataView;

  @ViewChild("permissionRolesTable")
  permissionsTableComponent!: Table;

  roles: Observable<Role[]>
  permissionItemsPerRole: { [key: string]: PermissionItem[] | undefined } = {};

  isAddRoleDialogDisplayed: boolean = false;

  permissionItemPickPool: PermissionItem[] = [];
  pickedPermissionItems: PermissionItem[] = [];

  roleNameFormControl = new FormControl('', [Validators.required])
  roleIsBasicFormControl = new FormControl(false);
  addRoleForm: FormGroup = new FormGroup({
    name: this.roleNameFormControl,
    isBasic: this.roleIsBasicFormControl,
  });

  constructor(
    private apiClient: FeolifeApiClient,
  ) {
    this.roles = this.apiClient.getRoles()
  }

  ngOnInit(): void {
  }

  loadPermissions(roleName: string) {
    this.apiClient.getRolePermissions(roleName).subscribe(permissions => {
      this.permissionItemsPerRole[roleName] = permissions.map(it => ({ permission: it }));
    })
  }

  onRolesSearchInput(event: Event) {
    const target = (event as InputEvent).target as HTMLInputElement
    this.rolesDataViewComponent.filter(target.value);
  }

  onRolePermissionsSearchInput(event: Event) {
    const target = (event as InputEvent).target as HTMLInputElement
    this.permissionsTableComponent.filterGlobal(target.value, 'contains')
  }

  onStartAddRoleDialog() {
    this.resetForm();
    this.isAddRoleDialogDisplayed = true;
  }

  onAddRoleFormSubmit() {
    if (this.addRoleForm.valid) {
      this.apiClient
        .createRole({
          name: this.roleNameFormControl.value,
          isAssignedOnUserProfileCreation: this.roleIsBasicFormControl.value,
          permissions: this.pickedPermissionItems.map(it => it.permission),
        })
        .subscribe(() => {
          this.isAddRoleDialogDisplayed = false;
        });
    }
  }

  isAddRoleFormValid(): boolean {
    return this.addRoleForm.valid && this.pickedPermissionItems.length > 0;
  }

  private resetForm() {
    this.permissionItemPickPool = (<any>Object).values(Permission).map((it: Permission) => ({ permission: it }));
    this.pickedPermissionItems = [];
  }
}

interface PermissionItem {
  permission: Permission
}
