import { Router } from 'express';
import { authMiddleware, refreshMiddleware } from '../middleware';
import { login, logout, register, refresh } from '../controllers';

export const authRoute = Router();

authRoute
  .post('/login', login)

  .post('/register', register)

  .post('/logout', authMiddleware, logout)

  .post('/refresh', refreshMiddleware, refresh);
