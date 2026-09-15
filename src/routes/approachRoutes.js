import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  getApproachData,
  createApproachData,
  updateApproachData,
  deleteApproachData,
} from "../controllers/approachController.js";

const router = express.Router();

// __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UPLOAD PATH: Direct root folder ku point kariba
// __dirname (src/routes) -> .. (src) -> .. (root) -> /uploads
const UPLOADS_PATH = path.resolve(__dirname, "../../uploads");

// Folder check (Just in case, na thile create kariba)
try {
  if (!fs.existsSync(UPLOADS_PATH)) {
    fs.mkdirSync(UPLOADS_PATH, { recursive: true });
    console.log("✅ Uploads folder created at:", UPLOADS_PATH);
  }
} catch (err) {
  console.error("❌ Error creating uploads folder:", err);
}

// MULTER STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // File upload pain folder check
    if (!fs.existsSync(UPLOADS_PATH)) {
      fs.mkdirSync(UPLOADS_PATH, { recursive: true });
    }
    cb(null, UPLOADS_PATH);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${Date.now()}-${baseName}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ROUTES
router.get("/", getApproachData);
router.post("/", upload.single("image"), createApproachData);
router.put("/:id", upload.single("image"), updateApproachData);
router.delete("/:id", deleteApproachData);

export default router;