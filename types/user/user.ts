export interface UserLoginData {
    id?: string;
    login: string;
    password: string;
}

export interface UserRegistrationData extends UserLoginData {
    name: string;
    surname: string;
    email: string;
    repeatPassword: string;
}
