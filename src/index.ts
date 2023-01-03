import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { userRouter } from './routers/user';
import { errorMiddleware } from './middleware';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

app.use(express.json());

app.use('/user', userRouter);

app.use(errorMiddleware);

app.listen(3001, '0.0.0.0', () => {
  console.log('Listening on port http://localhost:3001');
});
