import { Permission } from "src/app/store/state";
import { ExtensibleUserProfile } from "../feolife-api-client";
import { PeasantOwnershipClaimAssociatedUserProfile, PeasantOwnershipClaimStatus } from "./api-models";

export interface TokenAuthResponse {
    accessToken: string,
}

export interface UserProfileResponse {
    uuid: string,
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

export interface GetPeasantOwnershipClaimResponse {
    uuid: string,
    claimer: PeasantOwnershipClaimAssociatedUserProfile,
    peasant: GetPeasantOwnershipClaimsResponsePeasant,
    ownershipGrounds: string | null,
    status: PeasantOwnershipClaimStatus,
    reviewer: PeasantOwnershipClaimAssociatedUserProfile | null,
    resolutionComment: string | null,
    creationInstant: string,
    modificationInstant: string,
}

export interface GetPeasantOwnershipClaimsResponse {
    claims: GetPeasantOwnershipClaimsResponseClaim[],
    totalCount: number,
}

export interface GetPeasantOwnershipClaimsResponseClaim {
    uuid: string,
    claimer: PeasantOwnershipClaimAssociatedUserProfile,
    peasant: GetPeasantOwnershipClaimsResponsePeasant,
    ownershipGrounds: string | null,
    status: PeasantOwnershipClaimStatus,
    reviewer: PeasantOwnershipClaimAssociatedUserProfile | null,
    resolutionComment: string | null,
    creationInstant: string,
    modificationInstant: string,
}

export interface GetPeasantOwnershipClaimsResponsePeasant {
    firstName: string,
    lastName: string,
    middleName: string | null,
    birthDate: string | null,
    birthPlace: string | null,
    gender: string | null,
}
