import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { UserRecord } from '../records/user.record';
import { JwtPayload, TokenData } from '../types';
import { HttpException } from '../exceptions';

export const createAccessToken = (currentToken: string): TokenData => {
  const expiresIn = Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME);
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const payload: JwtPayload = {
    id: currentToken,
  };
  try {
    const accessToken = sign(payload, jwtSecretKey, { expiresIn });
    return {
      expiresIn,
      accessToken,
    };
  } catch (error) {
    throw new HttpException(error.statusCode, error.message);
  }
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

export const createAuthorizationCookie = (tokenData: TokenData) => {
  return `Authorization=${tokenData.accessToken}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
};
