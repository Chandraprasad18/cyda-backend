import express from 'express';
import { getAllReports, updateOrCreateReportCategory } from '../controllers/reportController.js';
import multer from 'multer';
import path from 'path';

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // uploads folder re save heba
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique name
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// GET all reports
router.get('/', getAllReports);

// PUT update/create specific category reports with file upload support
router.put('/:category', upload.any(), updateOrCreateReportCategory);

export default router;