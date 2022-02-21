import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataView } from 'primeng/dataview';
import { Table } from 'primeng/table';
import { Observable, of } from 'rxjs';
import { FeolifeApiClient, Role } from 'src/app/service/api/feolife-api-client';
import { Permission } from 'src/app/store/state';
import { ConfirmationService, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-management.component.html',
  styleUrls: ['./roles-list.component.scss'],
  providers: [ConfirmationService],
})
export class RolesManagementComponent implements OnInit {

  @ViewChild("rolesDataView")
  rolesDataViewComponent!: DataView;

  @ViewChild("permissionRolesTable")
  permissionsTableComponent!: Table;

  roles: Observable<Role[]> = of([]);
  permissionItemsPerRole: { [key: string]: PermissionItem[] | undefined } = {};

  isAddRoleDialogDisplayed: boolean = false;
  isEditRolePermissionsDialogDisplayed: boolean = false;
  editeeRole: Role | null = null;

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
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.loadRoles()
  }

  loadRoles() {
    this.roles = this.apiClient.getRoles()
  }

  loadPermissions(roleUuid: string) {
    this.apiClient.getRolePermissions(roleUuid).subscribe(permissions => {
      this.permissionItemsPerRole[roleUuid] = permissions.map(it => ({ permission: it }));
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
          this.loadRoles();
        });
    }
  }

  isAddRoleFormValid(): boolean {
    return this.addRoleForm.valid && this.pickedPermissionItems.length > 0;
  }

  onStartEditRolePermissions(role: Role) {
    this.editeeRole = role;
    this.permissionItemPickPool = (<any>Object).values(Permission)
      .filter((permission: Permission) => !this.permissionItemsPerRole[role.uuid]?.map(it => it.permission).includes(permission))
      .map((it: Permission) => ({ permission: it }));

    this.pickedPermissionItems = this.permissionItemsPerRole[role.uuid] ?? [];

    this.isEditRolePermissionsDialogDisplayed = true;
  }

  onDeleteRole(event: Event, role: Role) {
    this.confirmationService.confirm({
      target: event.target ?? undefined,
      message: `Вы точно хотите удалить роль "${role.name}"?`,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.apiClient
          .deleteRole(role.uuid)
          .subscribe(() => { this.loadRoles(); });
      },
      acceptLabel: 'Удалить',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Нет',
    })

  }

  onSaveRolePermissions() {
    if (this.editeeRole != null) {
      this.apiClient
        .setRolePermissions(this.editeeRole.uuid, this.pickedPermissionItems.map(it => it.permission))
        .subscribe(() => { this.isEditRolePermissionsDialogDisplayed = false; });
    }
  }

  private resetForm() {
    this.permissionItemPickPool = (<any>Object).values(Permission).map((it: Permission) => ({ permission: it }));
    this.pickedPermissionItems = [];
  }
}

interface PermissionItem {
  permission: Permission
}
