import { Request, Router } from "express";
import * as bcrypt from "bcrypt";
import { UserRecord } from "../records/user.record";
import { ValidationError } from "../utils/errors";
import { UserData } from "../types";

export const userRouter = Router();

userRouter.post("/login", (req: Request<{}, string, UserData>, res, next) => {
  const { email, password } = req.body;

  res.send("Login route");
});

userRouter.post(
  "/register",
  async (req: Request<{}, { id: string }, UserData>, res, next) => {
    const { email, password } = req.body;
    if (await UserRecord.getUserByEmail(email)) {
      throw new ValidationError("User about this email already exists.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserRecord({ email, password: hashedPassword });
    const id = await newUser.createUser();

    res.json({ id });
  }
);
