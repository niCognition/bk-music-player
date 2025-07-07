import mongoose, { Document, Schema } from "mongoose";
import { nowInSwedenISO } from "../utils/time";

export interface IUser extends Document {
    username: string;
    displayName: string;
    passwordHash: string;
    nextcloudUsername: string;
    nextcloudPasswordEncrypted: string;
    role: 'user' | 'kebadmin';
    createdBy: string;
    createdAt: string;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    nextcloudUsername: { type: String, required: true },
    nextcloudPasswordEncrypted: { type: String, required: true },
    role: { type: String, enum: ['user', 'kebadmin'], default: 'user'},
    createdBy: { type: String, default: 'kebabsystem' },
    createdAt: { type: String, default: nowInSwedenISO }
})

export const User = mongoose.model<IUser>('User', UserSchema)