import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { userRouter } from './routers/user';
import { errorMiddleware } from './middleware/errors.middleware';

const app = express();

app.use(express.json());

app.use('/user', userRouter);

app.use(errorMiddleware);

app.listen(3001, '0.0.0.0', () => {
  console.log('Listening on port http://localhost:3001');
});
