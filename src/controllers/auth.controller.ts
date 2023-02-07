import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ClientApiResponse, CookiesNames, UserLoginReq, UserRegisterReq, UserResponse } from '../types';
import { checkHash, clearCookie, hashData, sendResponse, setCookie, validateUserData } from '../utils';
import { UserRecord } from '../records/user.record';
import { UserWithThatEmailAlreadyExistsException, WrongCredentialsException } from '../exceptions';
import { createAccessToken, createRefreshToken, generateCurrentToken, serializeUserData } from '../services';

export const login: RequestHandler<unknown, ClientApiResponse<UserResponse>, UserLoginReq> = async (req, res, next) => {
  const { email, password } = validateUserData(req);

  const user = await UserRecord.getUserByEmail(email);
  if (!user) {
    throw new WrongCredentialsException();
  }
  const isMatched = await checkHash(password, user.password);
  if (!isMatched) {
    throw new WrongCredentialsException();
  }

  const accessTokenData = createAccessToken(await generateCurrentToken(user), user.id);
  const refreshTokenData = createRefreshToken(user.id);

  setCookie(res, CookiesNames.AUTHORIZATION, accessTokenData);
  setCookie(res, CookiesNames.REFRESH, refreshTokenData);

  sendResponse(res, 200, serializeUserData(user));
};

export const register: RequestHandler<unknown, ClientApiResponse<UserResponse>, UserRegisterReq> = async (
  req,
  res,
  next,
) => {
  const { email, password } = validateUserData(req);

  if (await UserRecord.getUserByEmail(email)) {
    throw new UserWithThatEmailAlreadyExistsException(email);
  }

  const hashedPassword = await hashData(password);
  const newUser = new UserRecord({ email, password: hashedPassword });
  await newUser.createUser();

  sendResponse(res, 201, serializeUserData(newUser));
};

export const logout: RequestHandler<unknown, ClientApiResponse<null>> = async (req, res, next) => {
  const loggedInUser = req.user;
  loggedInUser.currentToken = null;
  loggedInUser.refreshToken = null;
  await loggedInUser.update();

  clearCookie(res, CookiesNames.AUTHORIZATION);
  clearCookie(res, CookiesNames.REFRESH);

  sendResponse(res, 200, null);
};

export const refresh: RequestHandler<unknown, ClientApiResponse<UserResponse>> = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const currentToken = await generateCurrentToken(user);
  const accessToken = createAccessToken(currentToken, user.id);
  const refreshTokenData = createRefreshToken(user.id);

  setCookie(res, CookiesNames.AUTHORIZATION, accessToken);
  setCookie(res, CookiesNames.REFRESH, refreshTokenData);

  sendResponse(res, 200, serializeUserData(user));
};
