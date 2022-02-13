import { createAction, props } from "@ngrx/store";
import { UserProfile } from "./reducer";

export const setAuthenticated = createAction('SET_AUTHENTICATED')
export const setUnauthenticated = createAction('SET_ANAUTHENTICATED')
export const setAuthToken = createAction('SET_AUTH_TOKEN', props<{ authToken: string }>())
export const clearAuthToken = createAction('CLEAR_AUTH_TOKEN')
export const setProfile = createAction("SET_PROFILE", props<{ userProfile: UserProfile }>())