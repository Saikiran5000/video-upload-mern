const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Video = require("../models/Video");

const router = express.Router();

/* ---------- Multer Config ---------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
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
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

/* ---------- UPLOAD (Editor/Admin ONLY) ---------- */

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware(["editor", "admin"]),
  upload.single("video"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const video = await Video.create({
      filename: req.file.filename,
      uploadedBy: req.user.id,
      status: "processing",
      sensitivity: "pending"
    });

    res.json({
      message: "Video uploaded successfully",
      video
    });
  }
);

/* ---------- LIST MY VIDEOS (ALL ROLES) ---------- */

router.get(
  "/my-videos",
  authMiddleware,
  async (req, res) => {
    const videos = await Video.find({ uploadedBy: req.user.id });
    res.json(videos);
  }
);

/* ---------- STREAM VIDEO (ALL ROLES) ---------- */

router.get(
  "/stream/:filename",
  authMiddleware,
  (req, res) => {
    const filePath = path.join(__dirname, "../uploads", req.params.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Video not found");
    }

    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    if (!range) {
      return res.status(400).send("Range header required");
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4"
    });

    file.pipe(res);
  }
);

/* ---------- DELETE VIDEO (Editor/Admin ONLY) ---------- */

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["editor", "admin"]),
  async (req, res) => {
    const video = await Video.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const filePath = path.join(__dirname, "../uploads", video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await video.deleteOne();

    res.json({ message: "Video deleted successfully" });
  }
);

module.exports = router;
