import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { testRouter } from "./routers/test";
import { userRouter } from "./routers/user";
import { handleError } from "./utils/errors";

const app = express();

app.use("/test", testRouter);
app.use("/user", userRouter);

app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
  console.log("Listening on port http://localhost:3001");
});
