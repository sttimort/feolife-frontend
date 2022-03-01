import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, concatMap, map, merge, Observable, of, zip } from "rxjs";
import { environment } from "src/environments/environment";
import { MyUserProfile, Permission } from "../../store/state";
import { PeasantOwnershipClaim, PeasantOwnershipClaimStatus } from "./model/api-models";
import { CreatePeasantOwnershipClaimRequest, CreateRoleRequest, Peasant, PeasantRequest } from "./model/requests";
import { CitizenSearchResponse, GetPeasantOwnershipClaimResponse, GetPeasantOwnershipClaimsResponse, GetRolePermissionsResponse, GetRolesResponse, GetUserProfileRolesResponse, TokenAuthResponse, UserProfileResponse } from "./model/responses";

export interface CreateUserProfileRequest {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    middleName: string | null,
}

export class FeolifeApiError {
    constructor(
        public reason: FeolifeApiErrorReason,
        public cause: any,
    ) { }
}

export enum FeolifeApiErrorReason {
    API_UNAUTHENTICATED, OTHER
}

export interface ExtensibleUserProfile {
    uuid: string,
    firstName: string,
    lastName: string,
    middleName: String | null,
    gender: string | null,
    attributes: ResponseExtensionAttribute[],
}

export interface ExtensibleBillingAccount {
    uuid: string,
    attributes: ResponseExtensionAttribute[],
}

export interface ResponseExtensionAttribute {
    name: string,
    value: any | null,
}

export interface Role {
    uuid: string,
    name: string,
    isAssignedOnUserProfileCreation: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class FeolifeApiClient {

    constructor(
        private httpClient: HttpClient
    ) { }


    public putToExchange(id: string): Observable<void> {
        return this.httpClient.get<void>(`${environment.apiUrl}/put-to-exchange`, {
            params: {
                id: id
            }
        })
            .pipe(
                catchError(this.handleApiError())
            );
    }

    public getMyPeasants(): Observable<Peasant[]> {
        return this.httpClient.get<Peasant[]>(`${environment.apiUrl}/my-request`
        )
            .pipe(
                catchError(this.handleApiError())
            );
    }
    public getPeasantRequestSateList(): Observable<PeasantRequest[]> {
        return this.httpClient.get<PeasantRequest[]>(`${environment.apiUrl}/peasant-request`)
            .pipe(
                catchError(this.handleApiError())
            );
    }

    // *** authentication and registration ***

    public authenticate(username: string, password: string): Observable<string> {
        return this.httpClient
            .post<TokenAuthResponse>(
                `${environment.apiUrl}/auth`,
                null,
                {
                    headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` }
                }
            )
            .pipe(
                map(response => response.accessToken),
                catchError(this.handleApiError())
            );
    }

    public checkToken(token: string): Observable<void> {
        return this.httpClient
            .get<void>(
                `${environment.apiUrl}/my-user-profile`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            .pipe(catchError(this.handleApiError()));

    }

    public createUserProfile(request: CreateUserProfileRequest): Observable<void> {
        return this.httpClient
            .post<any>(
                `${environment.apiUrl}/username-password-profiles`,
                request,
            )
            .pipe(catchError(this.handleApiError()))
    }


    // *** my ***

    public getMyUserProfile(): Observable<MyUserProfile> {
        return this.httpClient
            .get<UserProfileResponse>(`${environment.apiUrl}/my-user-profile`)
            .pipe(
                map(response => ({
                    uuid: response.uuid,
                    username: response.credentials[0].username,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    middleName: response.middleName,
                    permissions: response.permissions
                        .filter(it => (<any>Object).values(Permission).includes(it))
                        .map(it => Permission[it as keyof typeof Permission]),
                }))
            );
    }


    public citizensSearch(query: string): Observable<ExtensibleUserProfile[]> {
        return this.httpClient
            .get<CitizenSearchResponse>(`${environment.apiUrl}/citizens`, {
                params: { query: query },
            })
            .pipe(
                map(it => it.citizens),
                catchError(this.handleApiError()),
            )
    }


    public approvePeasant(id: string, type: string): Observable<void> {
        return this.httpClient
            .post<any>(
                `${environment.apiUrl}/approve-peasant`,
                {
                    id: id,
                    type: type
                },
            )
            .pipe(catchError(this.handleApiError()))
    }

    // *** billing accounts ***

    public getBillingAccountByUserProfileUuid(userProfileUuid: string): Observable<ExtensibleBillingAccount> {
        return this.httpClient
            .get<ExtensibleBillingAccount>(`${environment.apiUrl}/user-profiles/${userProfileUuid}/billing-account`)
            .pipe(catchError(this.handleApiError()));
    }

    public fillUpBillingAccount(billingAccountUuid: string, value: number): Observable<void> {
        return this.httpClient
            .post<void>(
                `${environment.apiUrl}/billing-accounts/${billingAccountUuid}/fill-ups`,
                { value: value },
            )
            .pipe(catchError(this.handleApiError()));
    }


    // *** peasant ownership claims ***

    public getPeasantOwnershipClaim(claimUuid: string): Observable<PeasantOwnershipClaim> {
        return this.httpClient
            .get<GetPeasantOwnershipClaimResponse>(`${environment.apiUrl}/peasant-ownership-claims/${claimUuid}`)
            .pipe(
                map(response => ({
                    ...response,
                    peasant: {
                        ...response.peasant,
                        birthDate: response.peasant.birthDate != null ? new Date(Date.parse(response.peasant.birthDate)) : null,
                    },
                    creationInstant: new Date(Date.parse(response.creationInstant)),
                    modificationInstant: new Date(Date.parse(response.modificationInstant)),
                })),
                catchError(this.handleApiError()),
            )
    }

    public getPeasantOwnershipClaims(
        filter: {
            claimStatus: PeasantOwnershipClaimStatus | null,
            start: number | null,
            size: number | null,
        }
    ): Observable<{ claims: PeasantOwnershipClaim[], totalCount: number }> {
        const params: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {}
        if (filter.claimStatus != null) {
            params['status'] = PeasantOwnershipClaimStatus[filter.claimStatus]
        }
        if (filter.start != null) {
            params['start'] = filter.start
        }
        if (filter.size != null) {
            params['size'] = filter.size
        }

        return this.httpClient
            .get<GetPeasantOwnershipClaimsResponse>(
                `${environment.apiUrl}/peasant-ownership-claims`,
                { params: params, },
            )
            .pipe(
                map(response => {
                    return {
                        claims: response.claims.map(it => {
                            return {
                                uuid: it.uuid,
                                claimer: it.claimer,
                                peasant: {
                                    ...it.peasant,
                                    birthDate: it.peasant.birthDate != null ? new Date(Date.parse(it.peasant.birthDate)) : null,
                                },
                                ownershipGrounds: it.ownershipGrounds,
                                status: it.status,
                                reviewer: it.reviewer,
                                resolutionComment: it.resolutionComment,
                                creationInstant: new Date(Date.parse(it.creationInstant)),
                                modificationInstant: new Date(Date.parse(it.modificationInstant)),
                            }
                        }),
                        totalCount: response.totalCount,
                    }
                }),
                catchError(this.handleApiError()),
            )
    }

    public createPeasantOwnershipClaim(request: CreatePeasantOwnershipClaimRequest): Observable<void> {
        return this.httpClient
            .post<void>(`${environment.apiUrl}/peasant-ownership-claims`, request)
            .pipe(catchError(this.handleApiError()))
    }

    public startPeasantOwnershipCLaimReview(claimUuid: string): Observable<void> {
        return this.httpClient
            .post<void>(`${environment.apiUrl}/peasant-ownership-claims/${claimUuid}/review`, null)
            .pipe(catchError(this.handleApiError()))
    }

    public approvePeasantOwnershipClaim(claimUuid: string, comment: string): Observable<void> {
        return this.httpClient
            .post<void>(
                `${environment.apiUrl}/peasant-ownership-claims/${claimUuid}/approvals`,
                { resolutionComment: comment }
            )
            .pipe(catchError(this.handleApiError()))
    }

    public rejectPeasantOwnershipClaim(claimUuid: string, comment: string): Observable<void> {
        return this.httpClient
            .post<void>(
                `${environment.apiUrl}/peasant-ownership-claims/${claimUuid}/rejections`,
                { resolutionComment: comment }
            )
            .pipe(catchError(this.handleApiError()))
    }


    // *** roles ***

    public getRoles(): Observable<Role[]> {
        return this.httpClient
            .get<GetRolesResponse>(`${environment.apiUrl}/roles`)
            .pipe(
                map(it => it.roles),
                catchError(this.handleApiError()),
            );
    }

    public getRolePermissions(roleName: string): Observable<Permission[]> {
        return this.httpClient
            .get<GetRolePermissionsResponse>(`${environment.apiUrl}/roles/${roleName}/permissions`)
            .pipe(
                map(it => it.permissions),
                catchError(this.handleApiError()),
            );
    }

    public createRole(request: CreateRoleRequest): Observable<void> {
        return this.httpClient
            .post<void>(
                `${environment.apiUrl}/roles`,
                request,
            )
            .pipe(catchError(this.handleApiError()));
    }

    public setRolePermissions(roleUuid: string, permissions: Permission[]): Observable<void> {
        return this.httpClient
            .put<void>(
                `${environment.apiUrl}/roles/${roleUuid}/permissions`,
                { permissions: permissions },
            )
            .pipe(catchError(this.handleApiError()));
    }

    public deleteRole(roleUuid: string): Observable<void> {
        return this.httpClient
            .delete<void>(`${environment.apiUrl}/roles/${roleUuid}`)
            .pipe(catchError(this.handleApiError()));
    }

    public getUserProfileRoles(userProfileUuid: string): Observable<{ uuid: string, name: string }[]> {
        return this.httpClient
            .get<GetUserProfileRolesResponse>(`${environment.apiUrl}/user-profiles/${userProfileUuid}/roles`)
            .pipe(
                map(response => response.roles),
                catchError(this.handleApiError()),
            );
    }

    public assignRoles(userProfileUuid: string, roleUuids: string[]): Observable<void> {
        return this.httpClient
            .put<void>(
                `${environment.apiUrl}/user-profiles/${userProfileUuid}/roles`,
                { roleUuids: roleUuids },
            )
            .pipe(catchError(this.handleApiError()));
    }

    private handleApiError() {
        return (error: any, _: any) => {
            console.error('Api client got error', error);

            let reason = FeolifeApiErrorReason.OTHER;
            if ((error as HttpErrorResponse)?.status == 401) {
                reason = FeolifeApiErrorReason.API_UNAUTHENTICATED;
            }

            throw new FeolifeApiError(reason, error);
        };
    }
}
