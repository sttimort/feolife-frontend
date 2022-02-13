import { Action, createReducer, on } from "@ngrx/store";
import * as FeolifeAcions from "./actions";

export interface State {
    isAuthenticated: boolean | null,
    authToken: string | null,
    profile: UserProfile | null,
}

export interface UserProfile {
    username: string,
    firstName: string,
    lastName: string,
    middleName: string | null,
}

export const initialState: State = {
    isAuthenticated: null,
    authToken: null,
    profile: null,
}

const _feolifeReducer = createReducer(
    initialState,
    on(FeolifeAcions.setAuthenticated, state => ({ ...state, isAuthenticated: true })),
    on(FeolifeAcions.setUnauthenticated, state => ({ ...state, isAuthenticated: false })),
    on(FeolifeAcions.setAuthToken, (state, { authToken }) => ({ ...state, authToken: authToken })),
    on(FeolifeAcions.clearAuthToken, state => ({ ...state, authToken: null })),
    on(FeolifeAcions.setProfile, (state, { userProfile }) => ({ ...state, profile: userProfile })),
)

export function feolifeReducer(state: State | undefined, action: Action) {
    return _feolifeReducer(state, action)
}
