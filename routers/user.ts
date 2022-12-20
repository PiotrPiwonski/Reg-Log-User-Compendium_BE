import { Router, Request } from "express";
import { UserLoginData, UserRegistrationData } from "../types";

export const userRouter = Router();

userRouter.post(
  "/login",
  (req: Request<{}, string, UserLoginData>, res, next) => {
    const { email, password } = req.body;

    res.send("Login route");
  }
);

userRouter.post(
  "/register",
  (req: Request<{}, string, UserRegistrationData>, res, next) => {
    const { name, surname, email, password, repeatPassword } = req.body;

    res.send("Account registration route");
  }
);
