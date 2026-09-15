import express from 'express';
import { getHeroBySection, upsertHeroData, deleteHeroBySection } from '../controllers/heroMainController.js';
import upload from '../middleware/upload.js'; 

const router = express.Router();

router.get('/:section', getHeroBySection);
router.post('/:section', upload.single('coverImage'), upsertHeroData);
router.delete('/:section', deleteHeroBySection);

export default router;