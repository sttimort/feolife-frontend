import { Permission } from "src/app/store/state";

export interface CreateRoleRequest {
    name: string,
    isAssignedOnUserProfileCreation: Boolean,
    permissions: Permission[],
}

export interface SetRolePermissionsRequest {
    permissions: Permission[],
}

export interface createPeasantOwnershipClameRequest {
    firstName: string,
    middleName: string,
    lastName: string,
    bithDate: Date,
    placeBirth: string,
    owner: string
    sex: string
}