import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions';
import { ClientApiResponse } from '../types';

export const errorMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction): void => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  console.log({
    status,
    message,
    timestamp: new Date().toISOString(),
    path: req.url,
  });

  res.status(status).json({
    ok: false,
    status,
    error: message,
  } satisfies ClientApiResponse<null>);
};
