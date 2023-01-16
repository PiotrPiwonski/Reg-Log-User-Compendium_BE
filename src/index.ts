import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { userRouter } from './controllers/user.controller';
import { errorMiddleware } from './middleware';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config';

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);

app.use(errorMiddleware);

app.listen(3001, '0.0.0.0', () => {
  console.log('Listening on port http://localhost:3001');
});
