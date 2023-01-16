import { Response } from 'express';
import { CookiesNames, TokenData } from '../types';
import { CookieOptions } from 'express-serve-static-core';

const cookieOptions: CookieOptions = {
  maxAge: 0,
  secure: false,
  domain: 'localhost',
  httpOnly: true,
};

export const setCookie = (
  res: Response,
  cookieName: CookiesNames,
  tokenData: TokenData,
  additionalOptions?: CookieOptions,
): void => {
  res.cookie(cookieName, tokenData.token, {
    ...cookieOptions,
    maxAge: tokenData.expiresIn * 1000, // Example: JWT_ACCESS_TOKEN_EXPIRATION_TIME=3600 => Expires in 1 hour (3600 seconds * 1000 milliseconds).
    ...additionalOptions,
  });
};

export const clearCookie = (res: Response, cookieName: CookiesNames, additionalOptions?: CookieOptions): void => {
  res.clearCookie(cookieName, { ...cookieOptions, ...additionalOptions });
};
