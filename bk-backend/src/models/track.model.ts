import mongoose, { Schema, Document } from "mongoose";

export interface TrackDocument extends Document {
  title: string;
  artist: string;
  genre?: string;
  description?: string;
  tags?: string[];
  coverUrl?: string;
  audioUrl: string;
  createdAt: Date;
}

const trackSchema = new Schema<TrackDocument>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: String,
  description: String,
  tags: [String],
  coverUrl: String,
  audioUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Track = mongoose.model<TrackDocument>("Track", trackSchema);
