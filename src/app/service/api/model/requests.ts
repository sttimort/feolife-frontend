import { Permission } from "src/app/store/state";

export interface CreateRoleRequest {
    name: string,
    isAssignedOnUserProfileCreation: Boolean,
    permissions: Permission[],
}