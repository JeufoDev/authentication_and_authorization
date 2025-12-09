export type User = {
    id: string,
    username: string,
    email: string,
    role: string,
    password: string,
    created_at?: Date,
    updated_at?: Date
}

export type UserId = { id: string };

export type UserAuth = {
    id: string,
    username: string,
    email: string,
    role: string,
    password: string,
}

export type ExistingUserCheck = {
    usernameExists: boolean,
    emailExists: boolean
}