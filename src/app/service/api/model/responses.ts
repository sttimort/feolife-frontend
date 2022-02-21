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
    roles: Role[],
}

export interface GetRolePermissionsResponse {
    permissions: Permission[],
}