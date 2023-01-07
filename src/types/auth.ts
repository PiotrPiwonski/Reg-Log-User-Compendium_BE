import { Request } from 'express';
import { UserEntity } from './user';

export interface JwtPayload {
  id: string;
}
export interface TokenData {
  accessToken: string;
  expiresIn: number;
}
export interface RequestWithUser extends Request {
  user: UserEntity;
}
