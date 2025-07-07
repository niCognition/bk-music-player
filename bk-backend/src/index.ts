import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import trackRoutes from "./routes/track.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import fileUpload from "express-fileupload";
import cors from "cors";

connectDB();
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);
app.use(fileUpload());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/tracks", trackRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Börjes Kebab Backend is running..");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
