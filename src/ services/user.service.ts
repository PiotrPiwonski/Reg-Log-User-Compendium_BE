import {
  CookiesNames,
  RequestWithUser,
  UserEntity,
  UserLoginReq,
  UserLoginRes,
  UserRegisterReq,
  UserRegisterRes,
} from '../types';
import { NextFunction, Request, Response } from 'express';
import { UserWithThatEmailAlreadyExistsException, WrongCredentialsException } from '../exceptions';
import { UserRecord } from '../records/user.record';
import { createAccessToken, generateCurrentToken } from '../auth/token';
import { checkHash, hashData } from '../utils';
import { clearCookie, setCookie } from '../utils';
import { validateUserData } from '../utils';

export const login = async (
  req: Request<unknown, UserLoginRes, UserLoginReq>,
  res: Response<UserLoginRes>,
  next: NextFunction,
) => {
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

  setCookie(res, CookiesNames.AUTHORIZATION, accessTokenData);

  res.status(200).json(cleanUserData(user) as UserLoginRes);
};

export const register = async (
  req: Request<unknown, UserRegisterRes, UserRegisterReq>,
  res: Response<UserRegisterRes>,
  next: NextFunction,
) => {
  const { email, password } = validateUserData(req);

  if (await UserRecord.getUserByEmail(email)) {
    throw new UserWithThatEmailAlreadyExistsException(email);
  }

  const hashedPassword = await hashData(password);
  const newUser = new UserRecord({ email, password: hashedPassword });
  await newUser.createUser();

  res.status(201).json(cleanUserData(newUser) as UserRegisterRes);
};

export const logout = async (req: RequestWithUser, res: Response<{ ok: boolean }>, next: NextFunction) => {
  const loggedInUser = req.user;
  loggedInUser.currentToken = null;
  await loggedInUser.update();

  clearCookie(res, CookiesNames.AUTHORIZATION);
  res.status(200).json({ ok: true });
};
export const profile = async (req: RequestWithUser, res: Response<UserEntity>, next: NextFunction) => {
  const loggedInUser = req.user;

  res.status(200).json(cleanUserData(loggedInUser));
};

const cleanUserData = (user: UserEntity) => {
  delete user.password;
  delete user.currentToken;
  return user;
};
