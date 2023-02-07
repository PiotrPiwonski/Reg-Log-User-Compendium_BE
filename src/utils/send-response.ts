import { Response } from 'express';
import { ClientApiResponse } from '../types';

export const sendResponse = <T>(res: Response, status: number, data: T): void => {
  res.status(status).json({
    ok: true,
    data,
    status,
  } satisfies ClientApiResponse<T>);
};
