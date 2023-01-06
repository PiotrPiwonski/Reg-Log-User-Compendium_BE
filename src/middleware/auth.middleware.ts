import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from '../types';
import { DataStoredInToken } from '../auth/token';
import { UserRecord } from '../records/user.record';
import { AuthenticationTokenMissingException, WrongAuthenticationTokenException } from '../exceptions';

export interface RequestWithUser extends Request {
  user: UserEntity;
}

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET_KEY;
    const verificationRes = verify(cookies.Authorization, secret) as DataStoredInToken;
    const user = await UserRecord.getUserById(verificationRes.id);
    if (!user) {
      next(new WrongAuthenticationTokenException());
    }
    req.user = user;
    next();
  } else {
    next(new AuthenticationTokenMissingException());
  }
};
