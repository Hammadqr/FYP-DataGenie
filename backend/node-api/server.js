import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js"; // Import MongoDB connection function
import router from "./routes/signup.js";
import signin_router from "./routes/signin.js";
import predictRoutes from "./routes/predict.js"; // Import the prediction route

const app = express();
const PORT = 8080; // Change this to any free port (e.g., 8080)

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

app.use("/api/auth", router);
app.use("/api/auth1", signin_router);
app.use("/api/predict", predictRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
