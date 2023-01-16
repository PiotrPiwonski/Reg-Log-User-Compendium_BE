import { Router } from 'express';
import { authMiddleware } from '../middleware';
import { login, logout, profile, register } from '../controllers/user.controller';

export const userRoute = Router();

userRoute
  .post('/login', login)

  .post('/register', register)

  .post('/logout', authMiddleware, logout)

  .get('/profile', authMiddleware, profile);
