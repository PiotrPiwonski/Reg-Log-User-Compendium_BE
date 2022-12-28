import { Request, Router } from 'express';
import * as bcrypt from 'bcrypt';
import { UserRecord } from '../records/user.record';
import { UserData } from '../types';
import { ValidationException } from '../exceptions';

export const userRouter = Router();

userRouter.post(
  '/login',
  async (req: Request<unknown, { user: { id: string; token: string } }, UserData>, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Please include email and password.');
    }

    const user = await UserRecord.getUserByEmail(email);
    if (!user) {
      //TODO error status:401, message: "Wrong credentials provided"
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      //TODO error status:401, message: "Wrong credentials provided"
    }

    //TODO implementation Login Token

    res.json({ user: { id: user.id, token: 'token' } });
  },
);

userRouter.post('/register', async (req: Request<unknown, { id: string }, UserData>, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error('Please include email and password.');
  }
  if (await UserRecord.getUserByEmail(email)) {
    throw new ValidationException('User about this email already exists.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserRecord({ email, password: hashedPassword });
  const id = await newUser.createUser();

  res.json({ id });
});
