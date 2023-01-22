import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserRecord } from '../records/user.record';
import { JwtPayload, TokenData } from '../types';
import { HttpException } from '../exceptions';
import { hashData } from '../utils';

export const createAccessToken = (currentToken: string, userId: string): TokenData => {
  const expiresIn = Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME);
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const payload: JwtPayload = {
    id: userId,
    token: currentToken,
  };
  try {
    const accessToken = sign(payload, jwtSecretKey, { expiresIn });
    return {
      expiresIn,
      token: accessToken,
    };
  } catch (error) {
    throw new HttpException(error.statusCode, error.message);
  }
};

export const updateRefreshToken = async (userId: string, token: string): Promise<void> => {
  const user = await UserRecord.getUserById(userId);
  user.refreshToken = await hashData(token);
  await user.update();
};

export const createRefreshToken = (userId: string): TokenData => {
  const expiresIn = Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME);
  const jwtSecretKey = process.env.REFRESH_JWT_SECRET_KEY;
  try {
    const refreshToken = sign({ userId }, jwtSecretKey, { expiresIn });
    updateRefreshToken(userId, refreshToken);
    return {
      expiresIn,
      token: refreshToken,
    };
  } catch (error) {
    throw new HttpException(error.statusCode, error.message);
  }
};

export const generateCurrentToken = async (user: UserRecord): Promise<string> => {
  let currentToken: string;
  let currentHashedToken: string;
  let userWithThisToken: UserRecord | null = null;
  let isMatched = false;

  do {
    currentToken = uuid();
    currentHashedToken = await bcrypt.hash(currentToken, 10);
    userWithThisToken = await UserRecord.getUserById(user.id);
    if (userWithThisToken.currentToken) {
      isMatched = await bcrypt.compare(currentToken, userWithThisToken.currentToken);
    }
  } while (!!userWithThisToken && !!isMatched);
  user.currentToken = currentHashedToken;
  await user.update();
  return currentToken;
};
