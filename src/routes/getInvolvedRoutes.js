import express from 'express';
import { getInvolvedData, updateInvolvedData } from '../controllers/getInvolvedController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getInvolvedData);

router.put('/update', upload.fields([
  { name: 'handshakeIcon', maxCount: 1 },
  { name: 'footerImage', maxCount: 1 },
  { name: 'unstoppableImage', maxCount: 1 }
]), updateInvolvedData);

export default router;