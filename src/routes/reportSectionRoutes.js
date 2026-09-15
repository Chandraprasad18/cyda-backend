import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { 
    getReportSections, 
    createReportSection, 
    updateReportSection, 
    deleteReportSection 
} from "../controllers/reportSectionController.js";

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

const upload = multer({ storage });

router.get("/", getReportSections);
router.post("/", upload.single("reportFile"), createReportSection);
router.put("/:id", upload.single("reportFile"), updateReportSection);
router.delete("/:id", deleteReportSection);

export default router;