import User from "../model/user.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    console.log("Signup request received:", req.body);

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user instance
    user = new User({ name, email, password });

    // Save user to database
    console.log("Saving user...");
    await user.save();
    console.log("User saved successfully:", user);

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
