import { Permission } from "src/app/store/state";
import { ExtensibleUserProfile, Role } from "../feolife-api-client";

export interface TokenAuthResponse {
    accessToken: string,
}

export interface UserProfileResponse {
    firstName: string,
    lastName: string,
    middleName: string | null,
    credentials: Array<{ username: string }>,
    permissions: string[],
}

export interface CitizenSearchResponse {
    citizens: ExtensibleUserProfile[],
}

export interface GetRolesResponse {
    roles: { uuid: string, name: string, isAssignedOnUserProfileCreation: boolean }[],
}

export interface GetRolePermissionsResponse {
    permissions: Permission[],
}

export interface GetUserProfileRolesResponse {
    roles: { uuid: string, name: string }[],
}