import {Request, Router} from "express";
import {CreateUserReq, Role, UserLoginData, UserRegistrationData} from "../types";
import {UserRecord} from "../records/user.record";
import {ValidationError} from "../utils/errors";

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
   async (req: Request<{}, string, UserRegistrationData>, res, next) => {
    // const { name, surname, email, password, repeatPassword } = req.body;
    // @todo kurczak nie wiem jak mam typ ustawić w linijce podspodem na dzień dzisiejszy, ten Omit CreateUserReq coś mi się nie podoba
    const newUser = new UserRecord(req.body as any /*as CreateUserReq*/);
    newUser.role =  Role.User;
    const newUserEmail = newUser.email;
    const oldUser = await UserRecord.getUserByEmail(newUserEmail);
    if (oldUser) {
        throw new ValidationError('User about this email already exists.')
    }
    if (newUser.password !== newUser.confirmPassword) {
        throw new ValidationError('The password and its confirmation are not the same.')
    }

    await newUser.createUser();

    res.send(`User with email: ${newUser.email} added.`);
  }
);
