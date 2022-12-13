import express, {json} from "express";
import 'express-async-errors';
import {testRouter} from "./routers/test";
import {userRouter} from "./routers/user";
import {handleError, ValidationError } from "./utils/errors";

const app = express();

app.use(json());

app.use('/test', testRouter);
app.use('/user', userRouter);

app.get('/', async (res, req) => {
    throw new ValidationError('Błąd testowy!');
});

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
})