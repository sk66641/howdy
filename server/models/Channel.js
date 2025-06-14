const mongoose = require("mongoose");

// Define schema for a "Channel" collection
const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.ObjectId, ref: "Users", required: true }],
  admin: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
  messages: [{ type: mongoose.Schema.ObjectId, ref: "channelMessages", required: false }],
  bio: { type: String, default: "bio" },
  handle: { type: String, default: "fixing soon" },
  profileImage: { type: String, default: null },
  color: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` before saving a document
channelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to update `updatedAt` before findOneAndUpdate operation
channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Create and export the Channel model
exports.Channel = mongoose.model("Channels", channelSchema);
// export default Channel;
