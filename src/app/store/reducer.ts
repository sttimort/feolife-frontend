import { Action, createReducer, on } from "@ngrx/store";
// import { State } from "./state";
import * as FeolifeAcions from "./actions";
import { State } from "./state";

const initialState: State = {
    isAuthenticated: null,
    initialAuthServerFailure: null,
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
    on(FeolifeAcions.startInitialAuthCheck, state => ({
        ...state,
        isAuthenticated: null,
        authToken: null,
        initialAuthServerFailure: null,
    })),
    on(FeolifeAcions.initialAuthServerFailure, state => ({
        ...state,
        isAuthenticated: null,
        authToken: null,
        initialAuthServerFailure: true,
    })),
)

export function feolifeReducer(state: State | undefined, action: Action) {
    return _feolifeReducer(state, action)
}
