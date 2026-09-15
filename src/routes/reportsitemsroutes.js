import express from 'express';
import multer from 'multer';
import { getReportsByCategory, createReport } from '../controllers/reportitemscontroller.js';

const router = express.Router();

// Multer storage configuration for PDF/Files upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', getReportsByCategory);
router.post('/', upload.single('reportFile'), createReport);

export default router;