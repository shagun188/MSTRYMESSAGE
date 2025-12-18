// scripts/resetPassword.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import UserModel from "../app/model/user.ts";
 // ✅ relative path from scripts/

dotenv.config();

// Replace with your actual MongoDB connection string in .env
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mstrymessage";

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to database");

    // Replace these with the user email/username and new password
    const identifier = "shagunjoshi@gmail.com"; // email or username
    const newPassword = "mymymy";

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const existingUser = await UserModel.find();
console.log("All users:", existingUser);


    // Find the user and update password
    const user = await UserModel.findOneAndUpdate(
      { $or: [{ email: identifier }, { username: identifier }] },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log("❌ User not found");
    } else {
      console.log(`✅ Password updated for user: ${user.username}`);
    }

    // Disconnect
    await mongoose.disconnect();
    console.log("✅ Disconnected from database");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
