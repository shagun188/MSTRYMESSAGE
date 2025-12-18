/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is undefined! Check your .env file.");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));


