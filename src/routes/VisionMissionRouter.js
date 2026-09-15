import express from 'express';
import multer from 'multer';
import { getVisionMission, updateVisionMission, deleteVisionMission } from '../controllers/VisionMissionController.js';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', getVisionMission);
router.put('/', upload.single('image'), updateVisionMission);
router.post('/', upload.single('image'), updateVisionMission);
router.delete('/', deleteVisionMission);

export default router;