export interface State {
    isAuthenticated: boolean | null,
    initialAuthServerFailure: boolean | null,
    authToken: string | null,
    profile: UserProfile | null,
}

export interface UserProfile {
    username: string,
    firstName: string,
    lastName: string,
    middleName: string | null,
}
