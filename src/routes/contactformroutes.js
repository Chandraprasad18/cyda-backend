import express from 'express';
import { submitContactForm, getAllContactForms } from '../controllers/contactformcontroller.js';

const router = express.Router();

router.post('/submit', submitContactForm);
router.get('/all', getAllContactForms); // Admin panel re contact list fetch kariba pain route

export default router;