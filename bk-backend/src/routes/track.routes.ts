import express from "express";
import { Track } from "../models/track.model";
import { requireApiKey } from "../middleware/auth.middleware";
import { UploadedFile } from "express-fileupload";
import { uploadToNextcloud } from "../services/nextcloud.service";
import { nowInSwedenISO } from "../utils/time";

const router = express.Router();

router.get("/", requireApiKey, async (req, res) => {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

// router.get("/:id", requireApiKey, async (req, res) => {
//   try {
//     const track = await Track.findById(req.params.id);

//     if (!track) {
//       res.status(404).json({ error: "Track not found" });
//       return;
//     }

//     const trackObject = track.toObject();

//     res.json(trackObject);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch track" });
//   }
// });

router.get("/search", requireApiKey, async (req, res) => {
  try {
    const { title } = req.query;

    if (!title || typeof title !== "string") {
      res
        .status(400)
        .json({ error: "Missing or invalid title query parameter" });
      return;
    }

    const tracks = await Track.find({
      title: { $regex: title, $options: "i" },
    }).sort({ createdAt: -1 });

    const mapped = tracks.map((track) => {
      const obj = track.toObject();
      return obj;
    });

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search tracks" });
  }
});

router.post("/", requireApiKey, async (req, res) => {
  try {
    const file = req.files?.file as UploadedFile | undefined;

    const { title, artist, genre, description, tags, coverUrl } = req.body;

    if (!title || !artist) {
      res.status(400).json({ error: "Missing title or artist" });
      return;
    }

    let audioUrl = "";

    if (process.env.NEXTCLOUD_MOCK === "true" && !file) {
      // MOCK-mode: generates fake URL even without file input
      audioUrl = `https://mock.nextcloud.local/ai-music/${nowInSwedenISO}-mock.mp3`;
    } else {
      if (!file || file.mimetype !== "audio/mpeg") {
        res.status(400).json({ error: "Missing or invalid MP3 file" });
        return;
      }
      audioUrl = await uploadToNextcloud(file);
    }

    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : [];

    const newTrack = new Track({
      title,
      artist,
      genre,
      description,
      coverUrl,
      audioUrl,
      tags: parsedTags,
    });

    await newTrack.save();

    res.status(201).json(newTrack);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create track" });
  }
});

export default router;
