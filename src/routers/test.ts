import {Router} from "express";

export const testRouter = Router();

testRouter
    .get('/', (req, res) => {
     res.send('TEST');
 })
    .post('/', (req, res) => {
        console.log('Post test');
    })
    