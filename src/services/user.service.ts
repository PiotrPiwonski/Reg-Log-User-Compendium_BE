import { UserEntity } from '../types';

export const clearUserData = (user: UserEntity) => {
  delete user.password;
  delete user.currentToken;
  return user;
};
