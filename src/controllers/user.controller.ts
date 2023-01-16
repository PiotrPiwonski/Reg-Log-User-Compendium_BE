import { Router } from 'express';
import { authMiddleware } from '../middleware';
import { login, logout, profile, register } from '../ services/user.service';

export const userRouter = Router();

userRouter
  .post('/login', login)

  .post('/register', register)

  .post('/logout', authMiddleware, logout)

  .get('/profile', authMiddleware, profile);
