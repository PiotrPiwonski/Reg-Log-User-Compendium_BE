import { Request, Router } from 'express';
import { UserRecord } from '../records/user.record';
import { UserData } from '../types';
import { ValidationException } from '../exceptions';

export const userRouter = Router();

userRouter.post('/login', (req: Request<unknown, string, UserData>, res, next) => {
  const { email, password } = req.body;

  res.send('Login route');
});

userRouter.post('/register', async (req: Request<unknown, { id: string }, UserData>, res, next) => {
  if (await UserRecord.getUserByEmail(req.body.email)) {
    throw new ValidationException('User about this email already exists.');
  }
  const newUser = new UserRecord(req.body);

  const id = await newUser.createUser();

  res.json({ id });
});
