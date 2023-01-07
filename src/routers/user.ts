import { NextFunction, Request, Response, Router } from 'express';
import * as bcrypt from 'bcrypt';
import { UserRecord } from '../records/user.record';
import { RequestWithUser, UserLoginReq, UserLoginRes, UserRegisterReq, UserRegisterRes } from '../types';
import { HttpException, UserWithThatEmailAlreadyExistsException, WrongCredentialsException } from '../exceptions';
import { createAccessToken, generateCurrentToken, createAuthorizationCookie } from '../auth/token';
import { authMiddleware } from '../middleware';

export const userRouter = Router();

userRouter.post('/login', async (req: Request<unknown, UserLoginRes, UserLoginReq>, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new HttpException(400, 'Please include email and password.');
  }

  const user = await UserRecord.getUserByEmail(email);
  if (!user) {
    throw new WrongCredentialsException();
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new WrongCredentialsException();
  }

  const accessToken = await createAccessToken(await generateCurrentToken(user));

  delete user.password;
  delete user.currentToken;

  res
    .setHeader('Set-Cookie', [createAuthorizationCookie(accessToken)])
    .status(200)
    .json(user as UserLoginRes);
});

userRouter.post('/register', async (req: Request<unknown, UserRegisterRes, UserRegisterReq>, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpException(400, 'Please include email and password.');
  }

  if (await UserRecord.getUserByEmail(email)) {
    throw new UserWithThatEmailAlreadyExistsException(email);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserRecord({ email, password: hashedPassword });
  await newUser.createUser();
  delete newUser.password;

  // We cast type here, because we know that newUser instance will
  // definitely have id after running method createUser()

  res.status(201).json(newUser as UserRegisterRes);
});

userRouter.get('/logout', authMiddleware, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const loggedInUser = req.user;
  loggedInUser.currentToken = null;
  await loggedInUser.update();
  res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']).status(204);
});

userRouter.get('/profile', authMiddleware, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const loggedInUser = req.user;
  delete loggedInUser.password;

  res.status(200).json({ user: loggedInUser });
});
