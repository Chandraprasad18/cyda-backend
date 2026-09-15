import express from 'express';
import { submitVolunteerForm, getAllVolunteers } from '../controllers/BeVolunteerController.js';

const router = express.Router();

router.post('/submit', submitVolunteerForm);
router.get('/all', getAllVolunteers);

export default router;