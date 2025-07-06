import express from "express";
import { Track } from "../models/track.model";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const track = new Track(req.body);
    await track.save();
    res.status(201).json(track);
  } catch (err) {
    res.status(400).json({ error: "Invalid track data", details: err });
  }
});

export default router;
