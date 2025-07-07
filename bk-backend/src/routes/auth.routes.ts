import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }

  const user = await User.findOne({ username });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const accessToken = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: "14d" }
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "30d" }
  );

  res.json({
    accessToken,
    refreshToken,
    username: user.username,
    role: user.role,
  });
});

export default router;
