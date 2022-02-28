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
    DELETE_ROLE = 'DELETE_ROLE',
    ASSIGN_ROLES = 'ASSIGN_ROLES',
    
    LIST_ROLE_PERMISSIONS = 'LIST_ROLE_PERMISSIONS',
    CHANGE_ROLE_PERMISSIONS = 'CHANGE_ROLE_PERMISSIONS',

    // peasant ownership claims
    LIST_PEASANT_OWNERSHIP_CLAIMS = 'LIST_PEASANT_OWNERSHIP_CLAIMS',
    CREATE_PEASANT_OWNERSHIP_CLAIMS = 'CREATE_PEASANT_OWNERSHIP_CLAIMS',
    REVIEW_PEASANT_OWNERSHIP_CLAIMS = 'REVIEW_PEASANT_OWNERSHIP_CLAIMS',

    QUERY_BILLING_ACCOUNT = 'QUERY_BILLING_ACCOUNT',
    VIEW_BILLING_ACCOUNT_BALANCE = 'VIEW_BILLING_ACCOUNT_BALANCE',

    BILLING_ACCOUNT_FILL_UP = 'BILLING_ACCOUNT_FILL_UP',
}
