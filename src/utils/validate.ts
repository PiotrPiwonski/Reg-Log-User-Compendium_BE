import { Request } from 'express';
import { ClientApiResponse, UserLoginReq, UserRegisterReq, UserResponse } from '../types';
import { HttpException } from '../exceptions';

export const validateUserData = (
  req: Request<unknown, ClientApiResponse<UserResponse>, UserRegisterReq | UserLoginReq>,
) => {
  if (!req.body.email || !req.body.password) {
    throw new HttpException(400, 'Please include email and password.');
  }

  return { email: req.body.email, password: req.body.password };
};
