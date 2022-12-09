import express from "express";
import { Application } from "express";
import {testRouter} from "./routers/test";
import {userRouter} from "./routers/user";

const app = express();

app.use('/test', testRouter);
app.use('/user', userRouter);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
})