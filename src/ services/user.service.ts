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
import { HttpException, UserWithThatEmailAlreadyExistsException, WrongCredentialsException } from '../exceptions';
import { UserRecord } from '../records/user.record';
import { createAccessToken, generateCurrentToken } from '../auth/token';
import { checkHash, hashData } from '../utils/hash';

export const login = async (
  req: Request<unknown, UserLoginRes, UserLoginReq>,
  res: Response<UserLoginRes>,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new HttpException(400, 'Please include email and password.');
  }

  const user = await UserRecord.getUserByEmail(email);
  if (!user) {
    throw new WrongCredentialsException();
  }
  const isMatched = await checkHash(password, user.password);
  if (!isMatched) {
    throw new WrongCredentialsException();
  }

  const accessTokenData = createAccessToken(await generateCurrentToken(user), user.id);

  delete user.password;
  delete user.currentToken;

  res
    .cookie(CookiesNames.AUTHORIZATION, accessTokenData.accessToken, {
      maxAge: accessTokenData.expiresIn * 1000, // Example: JWT_ACCESS_TOKEN_EXPIRATION_TIME=3600 => Expires in 1 hour (3600 seconds * 1000 milliseconds).
      secure: false,
      domain: 'localhost',
      httpOnly: true,
    })
    .status(200)
    .json(cleanUserData(user) as UserLoginRes);
};

export const register = async (
  req: Request<unknown, UserRegisterRes, UserRegisterReq>,
  res: Response<UserRegisterRes>,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpException(400, 'Please include email and password.');
  }

  if (await UserRecord.getUserByEmail(email)) {
    throw new UserWithThatEmailAlreadyExistsException(email);
  }

  const hashedPassword = await hashData(password);
  const newUser = new UserRecord({ email, password: hashedPassword });
  await newUser.createUser();

  // We cast type here, because we know that newUser instance will
  // definitely have id after running method createUser()

  res.status(201).json(cleanUserData(newUser) as UserRegisterRes);
};

export const logout = async (req: RequestWithUser, res: Response<{ ok: boolean }>, next: NextFunction) => {
  const loggedInUser = req.user;
  loggedInUser.currentToken = null;
  await loggedInUser.update();
  res
    .status(200)
    .clearCookie(CookiesNames.AUTHORIZATION, {
      maxAge: 0,
      secure: false,
      domain: 'localhost',
      httpOnly: true,
    })
    .json({ ok: true });
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
