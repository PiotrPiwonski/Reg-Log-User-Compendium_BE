import { CookieOptions } from 'express-serve-static-core';

export const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'DELETE'],
  credentials: true,
};

export const cookieOptions: CookieOptions = {
  maxAge: 0,
  secure: false,
  domain: 'localhost',
  httpOnly: true,
};
