import express from "express";
import { signin } from "../controller/signin.js";

const signin_router = express.Router();

signin_router.post("/signin", signin);

export default signin_router;
