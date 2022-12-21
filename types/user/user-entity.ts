export enum Role{
    User = 1,
    Senior = 2,
    Admin = 3,
}

export interface UserEntity {
    id?: string;
    role?: Role;
    email: string;
    password: string;
}