import { UserEntity, UserResponse } from '../types';

export const serializeUserData = (user: UserEntity): UserResponse => {
  delete user.password;
  delete user.currentToken;
  delete user.refreshToken;
  return user satisfies UserResponse;
};
