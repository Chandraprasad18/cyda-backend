import express from 'express';
import { submitInternForm, getAllInterns } from '../controllers/BeInternController.js';

const router = express.Router();

router.post('/submit', submitInternForm);
router.get('/all', getAllInterns);

export default router;