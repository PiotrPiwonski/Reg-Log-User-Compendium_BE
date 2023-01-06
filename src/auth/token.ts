import { UserEntity } from '../types';
import { sign } from 'jsonwebtoken';

export interface TokenData {
  token: string;
  expiresIn: number;
}
export interface DataStoredInToken {
  id: string;
  email: string;
}
export const createToken = (user: UserEntity): TokenData => {
  const expiresIn = 60 * 60;
  const secret = process.env.JWT_SECRET_KEY;
  const dataStoredInToken: DataStoredInToken = {
    id: user.id,
    email: user.email,
  };
  return {
    expiresIn,
    token: sign(dataStoredInToken, secret, { expiresIn }),
  };
};
