import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, Observable } from "rxjs";
import { setProfile } from "../store/actions";
import { State } from "../store/state";
import { FeolifeApiClient } from "./api/feolife-api-client";

@Injectable({
    providedIn: 'root'
})
export class UserProfileManager {
    constructor(
        private apiClient: FeolifeApiClient,
        private store: Store<{ state: State }>,
    ) { }

    public fetchUserProfileInfo(): Observable<void> {
        return this.apiClient.getMyUserProfile().pipe(map(userProfileInfo => {
            this.store.dispatch(setProfile({ userProfile: userProfileInfo }));
        }));
    }
}