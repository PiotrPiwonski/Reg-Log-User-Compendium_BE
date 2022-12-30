import { Request, Router } from 'express';
import * as bcrypt from 'bcrypt';
import { UserRecord } from '../records/user.record';
import { UserLoginReq, UserLoginRes, UserRegisterReq, UserRegisterRes } from '../types';
import { HttpException, UserWithThatEmailAlreadyExistsException, WrongCredentialsException } from '../exceptions';

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

  //TODO implementation Login Token

  const loggedUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    token: 'token',
  };

  res.json(loggedUser);
});

userRouter.post('/register', async (req: Request<unknown, UserRegisterRes, UserRegisterReq>, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('Please include email and password.');
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

  res.json(newUser as UserRegisterRes);
});
