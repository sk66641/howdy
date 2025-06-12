const mongoose = require("mongoose");

// Define schema for a "Channel" collection
const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.ObjectId, ref: "Users", required: true }],
  admin: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
  messages: [{ type: mongoose.Schema.ObjectId, ref: "Messages", required: false }],
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
