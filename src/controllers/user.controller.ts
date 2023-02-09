import { ClientApiResponse, UserResponse } from '../types';
import { RequestHandler } from 'express';
import { serializeUserData } from '../services';
import { sendResponse } from '../utils';

export const profile: RequestHandler<unknown, ClientApiResponse<UserResponse>> = async (req, res, next) => {
  const loggedInUser = req.user;

  sendResponse(res, 200, serializeUserData(loggedInUser));
};
