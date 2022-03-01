export interface PeasantOwnershipClaim {
    uuid: string,
    claimer: PeasantOwnershipClaimAssociatedUserProfile,
    peasant: PeasantOwnershipClaimPeasant,
    ownershipGrounds: string | null,
    status: PeasantOwnershipClaimStatus,
    reviewer: PeasantOwnershipClaimAssociatedUserProfile | null,
    resolutionComment: string | null,
    creationInstant: Date,
    modificationInstant: Date,
}

export enum PeasantOwnershipClaimStatus {
    CREATED = 'CREATED',
    IN_REVIEW = 'IN_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface PeasantOwnershipClaimAssociatedUserProfile {
    uuid: string,
    firstName: string,
    lastName: string,
    middleName: string | null,
}

export interface PeasantOwnershipClaimPeasant {
    firstName: string,
    lastName: string,
    middleName: string | null,
    birthDate: Date | null,
    birthPlace: string | null,
    gender: string | null,
}
