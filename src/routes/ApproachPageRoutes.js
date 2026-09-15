import express from 'express';
import { 
    getApproachData, 
    saveApproachData, 
    updateApproachData, 
    deleteApproachData 
} from '../controllers/ApproachPageController.js';

import upload from '../middleware/upload.js';

const router = express.Router();

// GET all approach pages
router.get('/', getApproachData);

// POST (Create new approach page) - Multer middleware added for image upload
router.post('/', upload.single('image'), saveApproachData);

// PUT (Update approach page) - Multer middleware added for image upload
router.put('/:id', upload.single('image'), updateApproachData);

// DELETE approach page
router.delete('/:id', deleteApproachData);

export default router;