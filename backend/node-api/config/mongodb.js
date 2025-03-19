import mongoose from "mongoose";

// MongoDB Connection (Direct Credentials)
const MONGO_URI = "mongodb+srv://hammadqaiserrana:9r85uKImnavhw5sX@fyp-datagenie.nws5w.mongodb.net/?retryWrites=true&w=majority&appName=FYP-DataGenie";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // eslint-disable-next-line no-undef
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;
