import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, concatMap, map, merge, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { UserProfile } from "../store/state";

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

@Injectable({
    providedIn: 'root'
})
export class FeolifeApiClient {

    constructor(
        private httpClient: HttpClient
    ) { }

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
                `${environment.apiUrl}/user-profile`,
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

    public getUserProfileInfo(): Observable<UserProfile> {
        return this.httpClient
            .get<UserProfileResponse>(`${environment.apiUrl}/user-profile`)
            .pipe(
                map(response => ({
                    username: response.credentials[0].username,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    middleName: response.middleName,
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

    public getBillingAccountByUserProfileUuid(userProfileUuid: string): Observable<ExtensibleBillingAccount> {
        return this.httpClient
            .get<ExtensibleBillingAccount>(`${environment.apiUrl}/user-profiles/${userProfileUuid}/billing-account`)
            .pipe(catchError(this.handleApiError()));
    }

    public fillUpBillingAccount(billingAccountUuid: string, value: number ): Observable<void> {
        return this.httpClient
            .post<void>(
                `${environment.apiUrl}/billing-accounts/${billingAccountUuid}/fill-ups`,
                { value: value },
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

interface TokenAuthResponse {
    accessToken: string,
}

interface UserProfileResponse {
    firstName: string,
    lastName: string,
    middleName: string | null,
    credentials: Array<{ username: string }>,
}

interface CitizenSearchResponse {
    citizens: ExtensibleUserProfile[],
}

interface ResponseExtensionAttribute {
    name: string,
    value: any | null,
}