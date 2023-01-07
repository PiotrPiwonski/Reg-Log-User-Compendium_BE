import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { UserRecord } from '../records/user.record';
export interface TokenData {
  accessToken: string;
  expiresIn: number;
}
export interface JwtPayload {
  id: string;
}
export const createAccessToken = (currentToken: string): TokenData => {
  const expiresIn = 60 * 60;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const payload: JwtPayload = {
    id: currentToken,
  };
  return {
    expiresIn,
    accessToken: sign(payload, jwtSecretKey, { expiresIn }),
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
