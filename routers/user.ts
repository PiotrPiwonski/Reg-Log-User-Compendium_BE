import {Router} from "express";

export const userRouter = Router();

userRouter.post('/login', (req, res, next) => {

})

userRouter.post('/register', (req, res, next) => {
    const userData ={
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        email: req.body.email
    }
    res.send('Succes')
})
    