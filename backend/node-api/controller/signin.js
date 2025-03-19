import User from "../model/user.js";
import jwt from "jsonwebtoken";

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, "your_secret_key", { expiresIn: "7d" });
};

// **User Sign-in**
export const signin = async (req, res) => {
    try {
      console.log("Signin request received:", req.body); // Log received request
  
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found");
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Validate password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log("Invalid password");
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      // Generate JWT token
      const token = generateToken(user._id);
      console.log("Login successful, sending token");
  
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
      console.error("Error during signin:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  