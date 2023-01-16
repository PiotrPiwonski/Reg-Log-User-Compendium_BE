import { UserEntity } from '../types';
import { RequestHandler } from 'express';
import { serializeUserData } from '../services';

export const profile: RequestHandler<unknown, UserEntity> = async (req, res, next) => {
  const loggedInUser = req.user;

  res.status(200).json(serializeUserData(loggedInUser));
};
