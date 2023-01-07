import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JwtPayload, UserEntity } from '../types';

import { UserRecord } from '../records/user.record';
import { AuthenticationTokenMissingException, WrongAuthenticationTokenException } from '../exceptions';

export interface RequestWithUser extends Request {
  user: UserEntity;
}

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const cookies = req.cookies;

  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET_KEY;

    try {
      const verificationRes = verify(cookies.Authorization, secret) as JwtPayload;
      const user = await UserRecord.getUserById(verificationRes.id);
      console.log({ verificationRes, user });
      if (!user) {
        next(new WrongAuthenticationTokenException());
      }
      req.user = user;
      next();
    } catch (e) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
};
