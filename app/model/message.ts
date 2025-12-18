import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const MessageModel: Model<IMessage> =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
