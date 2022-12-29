// User Class Types

export enum UserRole {
  User = 1,
  Senior = 2,
  Admin = 3,
}

export type UserEntity = {
  id?: string;
  role?: UserRole;
  email: string;
  password: string;
};

export type UserCreatedInDb = {
  id: string;
  role: UserRole;
  email: string;
};

// User Requests

export type UserLoginReq = {
  email: string;
  password: string;
};

export type UserRegisterReq = UserLoginReq;

// User Responses

export type UserLoginRes = {
  id: string;
  role: UserRole;
  email: string;
  token: string;
};

export type UserRegisterRes = UserLoginRes;
