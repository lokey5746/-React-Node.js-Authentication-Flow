import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

// allows us to parse incoming requests:req.body
app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(
  5000,
  console.log(`Server running ${process.env.NODE_ENV} mode on port ${PORT}`)
);
