import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FeolifeApiClient } from "./api/feolife-api-client";
import { CreatePeasantOwnershipClaimRequest } from "./api/model/requests";

@Injectable({
    providedIn: 'root'
})
export class PeasantOwnershipClaimService {

    constructor(
        private apiClient: FeolifeApiClient,
    ) { }

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
}