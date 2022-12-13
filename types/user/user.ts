export interface UserLoginData {
    id?: string;
    email: string;
    password: string;
}

export interface UserRegistrationData extends UserLoginData {
    name: string;
    surname: string;
    repeatPassword: string;
}
