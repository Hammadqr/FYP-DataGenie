import express from "express";
import { signup } from "../controller/signup.js";
import { body } from "express-validator";

const router = express.Router();

// Signup Route with Validation
router.post(
  "/signup",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Valid email is required").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 })
  ],
  signup
);

export default router;
