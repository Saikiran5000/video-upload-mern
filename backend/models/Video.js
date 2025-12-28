const mongoose = require("mongoose");
const videoSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["processing", "completed"],
    default: "processing"
  },
  sensitivity: {
    type: String,
    enum: ["pending", "safe", "flagged"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Video", videoSchema);
