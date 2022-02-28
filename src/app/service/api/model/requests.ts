import { Permission } from "src/app/store/state";

export interface CreateRoleRequest {
    name: string,
    isAssignedOnUserProfileCreation: Boolean,
    permissions: Permission[],
}

export interface SetRolePermissionsRequest {
    permissions: Permission[],
}

export interface CreatePeasantOwnershipClameRequest {
    firstName: string,
    middleName: string,
    lastName: string,
    bithDate: Date,
    placeBirth: string,
    owner: string
    sex: string
}
export interface Peasant extends  CreatePeasantOwnershipClameRequest{
    id:string
}