import { Request } from 'express';
import { UserRecord } from '../records/user.record';

export interface JwtPayload {
  id: string;
  token: string;
}
export interface TokenData {
  token: string;
  expiresIn: number;
}
export interface RequestWithUser extends Request {
  user: UserRecord;
}
export enum CookiesNames {
  AUTHORIZATION = 'Authorization',
}
