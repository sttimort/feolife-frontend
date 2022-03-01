import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FeolifeApiClient } from "./api/feolife-api-client";
import { PeasantOwnershipClaim, PeasantOwnershipClaimStatus } from "./api/model/api-models";
import { CreatePeasantOwnershipClaimRequest } from "./api/model/requests";

@Injectable({
    providedIn: 'root'
})
export class PeasantOwnershipClaimService {

    constructor(
        private apiClient: FeolifeApiClient,
    ) { }


    public initiateGetClaim(claimUuid: string): Observable<PeasantOwnershipClaim> {
        return this.apiClient.getPeasantOwnershipClaim(claimUuid)
    }

    public initiateGetClaims(
        filter: { claimStatus: PeasantOwnershipClaimStatus | null, start: number, size: number }
    ): Observable<{ claims: PeasantOwnershipClaim[], totalCount: number }> {
        return this.apiClient.getPeasantOwnershipClaims(filter);
    }

    public initiatePeasantClaimCreation(data: CreatePeasantOwnershipClaimRequest): Observable<void> {
        let birthDate: Date | null = null;
        if (data.peasantBirthDate != null) {
            birthDate = new Date()
            birthDate.setUTCFullYear(data.peasantBirthDate.getFullYear())
            birthDate.setUTCMonth(data.peasantBirthDate.getMonth());
            birthDate.setUTCDate(data.peasantBirthDate.getDate());
        }

        return this.apiClient
            .createPeasantOwnershipClaim({
                ...data,
                peasantBirthDate: birthDate,
            })
    }

    public initiateStartReview(claimUuid: string): Observable<void> {
        return this.apiClient.startPeasantOwnershipCLaimReview(claimUuid)
    }

    public initiateApproval(claimUuid: string, comment: string): Observable<void> {
        return this.apiClient.approvePeasantOwnershipClaim(claimUuid, comment)
    }

    public initiateRejection(claimUuid: string, comment: string): Observable<void> {
        return this.apiClient.rejectPeasantOwnershipClaim(claimUuid, comment)
    }
}