import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { CookiesNames, RefreshJwtPayload } from '../types';
import { UserRecord } from '../records/user.record';
import { RefreshTokenMissingException, WrongRefreshTokenException } from '../exceptions';
import { checkHash } from '../utils';

export const refreshMiddleware: RequestHandler<unknown> = async (req, res, next) => {
  const cookies = req.cookies;
  const refreshToken = cookies[CookiesNames.REFRESH];

  if (cookies && refreshToken) {
    try {
      const jwtSecretKey = process.env.REFRESH_JWT_SECRET_KEY;
      const verificationRes = verify(refreshToken, jwtSecretKey) as RefreshJwtPayload;
      const user = await UserRecord.getUserById(verificationRes.userId);
      if (!user) {
        next(new RefreshTokenMissingException());
      }
      const isMatched = await checkHash(refreshToken, user.refreshToken);
      if (!isMatched) {
        next(new WrongRefreshTokenException());
      }
      req.user = user;
      next();
    } catch (e) {
      next(new WrongRefreshTokenException());
    }
  } else {
    next(new RefreshTokenMissingException());
  }
};
