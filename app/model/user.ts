import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isverified: boolean;
  isAcceptingMessages: boolean;
  messages: mongoose.Types.ObjectId[];
  verificationToken?: string;
  verificationTokenExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isverified: { type: Boolean, default: false },
    isAcceptingMessages: { type: Boolean, default: true },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],

    // ⭐ YOU WERE MISSING THESE TWO
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
