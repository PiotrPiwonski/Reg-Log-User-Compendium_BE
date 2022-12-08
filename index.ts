import * as express from "express";
import {testRouter} from "./routers/test";

const app = express();

app.use('/test', testRouter);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
})