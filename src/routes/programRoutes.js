import express from 'express';
import { getProgramByCategory, upsertProgramData } from '../controllers/programController.js';

const router = express.Router();

router.post('/save', upsertProgramData);

router.get('/:category', getProgramByCategory);

export default router;