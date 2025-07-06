import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import trackRoutes from "./routes/track.routes";
connectDB();
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/tracks', trackRoutes);

app.get("/", (req, res) => {
  res.send("Börjes Kebab Backend is running..");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
