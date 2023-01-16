import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from '../types';
import { UserRecord } from '../records/user.record';
import { AuthenticationTokenMissingException, WrongAuthenticationTokenException } from '../exceptions';
import { checkHash } from '../utils';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserRecord;
    }
  }
}
export const authMiddleware: RequestHandler<unknown> = async (req, res, next) => {
  const cookies = req.cookies;

  if (cookies && cookies.Authorization) {
    try {
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      const verificationRes = verify(cookies.Authorization, jwtSecretKey) as JwtPayload;
      const user = await UserRecord.getUserById(verificationRes.id);
      if (!user) {
        next(new WrongAuthenticationTokenException());
      }
      const isMatched = await checkHash(verificationRes.token, user.currentToken);
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
