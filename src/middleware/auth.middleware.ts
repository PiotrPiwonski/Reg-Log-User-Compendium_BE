import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtPayload, RequestWithUser } from '../types';
import { UserRecord } from '../records/user.record';
import { AuthenticationTokenMissingException, WrongAuthenticationTokenException } from '../exceptions';

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const cookies = req.cookies;

  if (cookies && cookies.Authorization) {
    try {
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      const verificationRes = verify(cookies.Authorization, jwtSecretKey) as JwtPayload;
      console.log({ verificationRes });
      const user = await UserRecord.getUserById(verificationRes.id);
      if (!user) {
        next(new WrongAuthenticationTokenException());
      }
      const isMatched = await bcrypt.compare(verificationRes.token, user.currentToken);
      if (!isMatched) {
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
