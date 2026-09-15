import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { 
    getReportsHeroData, 
    createReportsHeroData, 
    updateReportsHeroData, 
    deleteReportsHeroData 
} from "../controllers/reportsHeroController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_PATH = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(UPLOADS_PATH)) {
    fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_PATH);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
        cb(null, `${Date.now()}-${baseName}${ext}`);
    },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/", getReportsHeroData);
router.post("/", upload.single("image"), createReportsHeroData);
router.put("/:id", upload.single("image"), updateReportsHeroData);
router.delete("/:id", deleteReportsHeroData);

export default router;