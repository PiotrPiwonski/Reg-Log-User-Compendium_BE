import { UserEntity } from '../types';

export const serializeUserData = (user: UserEntity) => {
  delete user.password;
  delete user.currentToken;
  delete user.refreshToken;
  return user;
};
