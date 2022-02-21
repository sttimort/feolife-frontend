export interface State {
    isAuthenticated: boolean | null,
    initialAuthServerFailure: boolean | null,
    authToken: string | null,
    profile: MyUserProfile | null,
}

export interface MyUserProfile {
    username: string,
    firstName: string,
    lastName: string,
    middleName: string | null,
    permissions: Permission[],
}

export enum Permission {
    LOGIN = 'LOGIN',
    VIEW_BIRTHDATE_AND_AGE = 'VIEW_BIRTHDATE_AND_AGE',

    LIST_ROLES = 'LIST_ROLES',
    CREATE_ROLE = 'CREATE_ROLE',

    QUERY_BILLING_ACCOUNT = 'QUERY_BILLING_ACCOUNT',
    VIEW_BILLING_ACCOUNT_BALANCE = 'VIEW_BILLING_ACCOUNT_BALANCE',

    BILLING_ACCOUNT_FILL_UP = 'BILLING_ACCOUNT_FILL_UP',
}
