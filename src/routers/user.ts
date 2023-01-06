import { Request, Router } from 'express';
import * as bcrypt from 'bcrypt';
import { UserRecord } from '../records/user.record';
import { UserLoginReq, UserRegisterReq, UserRegisterRes } from '../types';
import { HttpException, UserWithThatEmailAlreadyExistsException, WrongCredentialsException } from '../exceptions';
import { createToken } from '../auth/token';
import { createAuthorizationCookie } from '../utils/cookie';

export const userRouter = Router();

userRouter.post('/login', async (req: Request<unknown, { success: boolean }, UserLoginReq>, res, next) => {
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

  const tokenData = createToken(user);

  res
    .setHeader('Set-Cookie', [createAuthorizationCookie(tokenData)])
    .status(200)
    .json({ success: true });
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
