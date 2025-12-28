const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Video = require("../models/Video");

const router = express.Router();

/* =======================
   Multer Configuration
======================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Only MP4 files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500 MB
  }
});

/* =======================
   Upload Video
======================= */

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware(["editor", "admin"]),
  upload.single("video"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save metadata in DB
    const video = await Video.create({
      filename: req.file.filename,
      uploadedBy: req.user.id,
      status: "processing",
      sensitivity: "pending"
    });

    /* -------- Socket.io progress (FAKE) -------- */
    const io = req.app.get("io");
    let progress = 0;

    const interval = setInterval(() => {
      progress += 20;

      io.emit("video-progress", {
        filename: req.file.filename,
        progress
      });

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 1000);
    /* ------------------------------------------- */

    res.json({
      message: "Video uploaded successfully",
      video
    });
  }
);

/* =======================
   Get My Videos
======================= */

router.get("/my-videos", authMiddleware, async (req, res) => {
  const videos = await Video.find({ uploadedBy: req.user.id });
  res.json(videos);
});

/* =======================
   Delete Video
======================= */

router.delete("/:id", authMiddleware, async (req, res) => {
  const video = await Video.findOne({
    _id: req.params.id,
    uploadedBy: req.user.id
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  // delete file from uploads folder
  const filePath = path.join(__dirname, "../uploads", video.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // delete DB record
  await video.deleteOne();

  res.json({ message: "Video deleted successfully" });
});

module.exports = router;
