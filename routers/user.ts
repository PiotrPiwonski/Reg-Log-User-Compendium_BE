import {Request, Router} from "express";
import { Role } from "../types";
import {UserRecord} from "../records/user.record";
import {ValidationError} from "../utils/errors";
import {UserData} from "../types";

export const userRouter = Router();

userRouter.post(
  "/login",
  (req: Request<{}, string, UserData>, res, next) => {
    const { email, password } = req.body;

    res.send("Login route");
  }
);

userRouter.post(
  "/register",
   async (req: Request<{}, { id: string} , UserData>, res, next) => {

    if (await UserRecord.getUserByEmail(req.body.email)) {
           throw new ValidationError('User about this email already exists.')
    }
    const newUser = new UserRecord(req.body);

    const id = await newUser.createUser();


    res.json({ id });
  }
);
