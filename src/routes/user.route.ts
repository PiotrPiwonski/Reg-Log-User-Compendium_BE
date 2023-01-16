import { Router } from 'express';
import { authMiddleware } from '../middleware';
import { profile } from '../controllers';

export const userRoute = Router();

userRoute.get('/profile', authMiddleware, profile);
