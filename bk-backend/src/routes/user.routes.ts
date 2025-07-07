import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";
import { nowInSwedenISO } from "../utils/time";

const router = express.Router();

router.post("/", /*requireAuth,*/ async (req: AuthenticatedRequest, res) => {
  try {
    const {
      username,
      displayName,
      password,
      nextcloudUsername,
      nextcloudPassword,
      role,
    } = req.body;

    if (
      !username ||
      !displayName ||
      !password ||
      !nextcloudUsername ||
      !nextcloudPassword
    ) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nextcloudPasswordEncrypted =
      Buffer.from(nextcloudPassword).toString("base64"); // Temporary, later AES

    const createdUser = await User.create({
      username,
      displayName,
      passwordHash,
      nextcloudPasswordEncrypted,
      role: role || "user",
      createdBy: req.user?.username || "kebabsystem",
      createdAt: nowInSwedenISO(),
    });

    res
      .status(201)
      .json({ message: "User created", user: createdUser.username });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

export default router;