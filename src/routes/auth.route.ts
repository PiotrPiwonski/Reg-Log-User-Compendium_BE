import { Router } from 'express';
import { authMiddleware } from '../middleware';
import { login, logout, register } from '../controllers';

export const authRoute = Router();

authRoute
  .post('/login', login)

  .post('/register', register)

  .post('/logout', authMiddleware, logout);
