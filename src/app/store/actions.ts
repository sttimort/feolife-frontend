import { createAction, props } from "@ngrx/store";
import { MyUserProfile } from "./state";

export const setAuthenticated = createAction('SET_AUTHENTICATED')
export const setUnauthenticated = createAction('SET_ANAUTHENTICATED')
export const setAuthToken = createAction('SET_AUTH_TOKEN', props<{ authToken: string }>())
export const clearAuthToken = createAction('CLEAR_AUTH_TOKEN')
export const setProfile = createAction("SET_PROFILE", props<{ userProfile: MyUserProfile }>())

export const initialAuthServerFailure = createAction('INITIAL_AUTH_SERVER_FAILURE')
export const startInitialAuthCheck = createAction('START_INITIAL_AUTH_CHECK')