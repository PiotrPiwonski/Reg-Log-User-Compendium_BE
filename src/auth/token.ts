import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
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
  let token: string;
  let currentToken: string;
  let userWithThisToken: UserRecord | null = null;
  let isMatched = false;

  do {
    token = uuid();
    currentToken = await bcrypt.hash(token, 10);
    userWithThisToken = await UserRecord.getUserWithToken(currentToken);
    if (userWithThisToken) {
      isMatched = await bcrypt.compare(token, userWithThisToken.currentToken);
    }
  } while (!!userWithThisToken && !!isMatched);
  user.currentToken = currentToken;
  await user.update();
  return currentToken;
};
