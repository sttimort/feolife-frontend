import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, concatMap, map, merge, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { MyUserProfile, Permission } from "../../store/state";
import { CreatePeasantOwnershipClameRequest, CreateRoleRequest, Peasant, PeasantRequest } from "./model/requests";
import { CitizenSearchResponse, GetRolePermissionsResponse, GetRolesResponse, GetUserProfileRolesResponse, TokenAuthResponse, UserProfileResponse } from "./model/responses";

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

    public getPeasantRequestSateList() : Observable<PeasantRequest[]>{
        return this.httpClient.get<PeasantRequest[]>( `${environment.apiUrl}/peasant-request`)
        .pipe(
            catchError(this.handleApiError())
        );
    }

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

    public getMyUserProfile(): Observable<MyUserProfile> {
        return this.httpClient
            .get<UserProfileResponse>(`${environment.apiUrl}/my-user-profile`)
            .pipe(
                map(response => ({
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

    public approvePeasant(id:string, type:string):Observable<void>{
        return this.httpClient
        .post<any>(
            `${environment.apiUrl}/approve-peasant`,
            {
                id:id,
                type:type
            },
        )
        .pipe(catchError(this.handleApiError()))
    }
    public createUserProfile(request: CreateUserProfileRequest): Observable<void> {
        return this.httpClient
            .post<any>(
                `${environment.apiUrl}/username-password-profiles`,
                request,
            )
            .pipe(catchError(this.handleApiError()))
    }

    public getActualPeasants():Observable<Peasant[]>{
        return this.httpClient
        .get<Peasant[]>(`${environment.apiUrl}/actual-peasants`)
        .pipe(
            catchError(this.handleApiError()),
        )
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

    public getBillingAccountByUserProfileUuid(userProfileUuid: string): Observable<ExtensibleBillingAccount> {
        return this.httpClient
            .get<ExtensibleBillingAccount>(`${environment.apiUrl}/peasant-ownership-claims`)
            .pipe(catchError(this.handleApiError()));
    }

    public createPeasantOwnershipClame(object:CreatePeasantOwnershipClameRequest):Observable<void>{
        return this.httpClient.post<void>("",object).pipe(catchError(this.handleApiError()));
    }

    public fillUpBillingAccount(billingAccountUuid: string, value: number): Observable<void> {
        return this.httpClient
            .post<void>(
                `${environment.apiUrl}/billing-accounts/${billingAccountUuid}/fill-ups`,
                { value: value },
            )
            .pipe(catchError(this.handleApiError()));
    }

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
