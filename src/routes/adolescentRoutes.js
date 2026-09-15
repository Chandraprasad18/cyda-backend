import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { 
    getAdolescentData, 
    createAdolescentData, 
    updateAdolescentData, 
    deleteAdolescentData, 
} from "../controllers/adolescentController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.js sathe exact match kariba pain UPLOADS_PATH ku eparimiti set karidiyantu
const UPLOADS_PATH = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(UPLOADS_PATH)) {
    fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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
    limits: { fileSize: 10 * 1024 * 1024 }, 
});

router.get("/", getAdolescentData);
router.post("/", upload.single("image"), createAdolescentData);
router.put("/:id", upload.single("image"), updateAdolescentData);
router.delete("/:id", deleteAdolescentData);

export default router;