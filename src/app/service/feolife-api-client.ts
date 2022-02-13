import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { UserProfile } from "../store/reducer";
import { Nothing } from "../utils/utils";

export interface CreateUserProfileRequest {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    middleName: string | null,
}

export class FeolifeApiUnauthenticatedError { }


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
            .pipe(catchError((error, _) => {
                console.error('Api client got error', error);

                if ((error as HttpErrorResponse)?.status == 401) {
                    throw new FeolifeApiUnauthenticatedError();
                } else {
                    throw error;
                }
            }))
            .pipe(map(response => response.accessToken));
    }

    public checkToken(token: string): Observable<Nothing> {
        return this.httpClient
            .get<any>(
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

    private handleApiError() {
        return (error: any, _: any) => {
            console.error('Api client got error', error);

            if ((error as HttpErrorResponse)?.status == 401) {
                throw new FeolifeApiUnauthenticatedError();
            } else {
                throw error;
            }
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
