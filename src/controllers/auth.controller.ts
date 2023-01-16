import { RequestHandler } from 'express';
import { CookiesNames, UserLoginReq, UserLoginRes, UserRegisterReq, UserRegisterRes } from '../types';
import { checkHash, clearCookie, hashData, setCookie, validateUserData } from '../utils';
import { UserRecord } from '../records/user.record';
import { UserWithThatEmailAlreadyExistsException, WrongCredentialsException } from '../exceptions';
import { clearUserData } from '../services';
import { createAccessToken, generateCurrentToken } from '../services';

export const login: RequestHandler<unknown, UserLoginRes, UserLoginReq> = async (req, res, next) => {
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

  res.status(200).json(clearUserData(user));
};

export const register: RequestHandler<unknown, UserRegisterRes, UserRegisterReq> = async (req, res, next) => {
  const { email, password } = validateUserData(req);

  if (await UserRecord.getUserByEmail(email)) {
    throw new UserWithThatEmailAlreadyExistsException(email);
  }

  const hashedPassword = await hashData(password);
  const newUser = new UserRecord({ email, password: hashedPassword });
  await newUser.createUser();

  res.status(201).json(clearUserData(newUser));
};

export const logout: RequestHandler<unknown, { ok: boolean }> = async (req, res, next) => {
  const loggedInUser = req.user;
  loggedInUser.currentToken = null;
  await loggedInUser.update();

  clearCookie(res, CookiesNames.AUTHORIZATION);
  res.status(200).json({ ok: true });
};
