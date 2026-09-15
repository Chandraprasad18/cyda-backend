import express from 'express';
import { 
    getStoriesBySection, 
    addStory, 
    updateStory, 
    deleteStory 
} from '../controllers/StoryController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// 1. Static routes sabubele upare rahiba
router.post('/add', upload.single('thumbnail'), addStory);
router.put('/update/:id', upload.single('thumbnail'), updateStory);

// 2. Dynamic parameter routes tale rahiba
router.get('/:sectionName', getStoriesBySection);
router.delete('/:id', deleteStory);

export default router;