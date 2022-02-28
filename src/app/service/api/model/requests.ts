import { Permission } from "src/app/store/state";

export interface CreateRoleRequest {
    name: string,
    isAssignedOnUserProfileCreation: Boolean,
    permissions: Permission[],
}

export interface SetRolePermissionsRequest {
    permissions: Permission[],
}

export interface CreatePeasantOwnershipClaimRequest {
    peasantFirstName: string,
    peasantLastName: string,
    peasantMiddleName: string | null,
    peasantGender: string | null,
    peasantBirthDate: Date | null,
    peasantBirthPlace: string | null,
    ownershipGrounds: string | null,
}
export interface Peasant extends CreatePeasantOwnershipClaimRequest {
    id: string
}

export interface PeasantRequest extends CreatePeasantOwnershipClaimRequest {
    state: string
}