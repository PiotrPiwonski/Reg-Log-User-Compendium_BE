import { UserEntity } from '../types';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { UserRecord } from '../records/user.record';
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

export const generateCurrentToken = async (user: UserRecord): Promise<string> => {
  let currentToken: string | null = null;
  let userWithThisToken: UserRecord | null = null;

  do {
    currentToken = uuid();
    userWithThisToken = await UserRecord.getUserWithToken(currentToken);
  } while (!!userWithThisToken);
  user.currentToken = currentToken;
  await user.update();
  return currentToken;
};
