import express from 'express';
import { submitPartnerForm, getAllPartners } from '../controllers/bepartnerscontroller.js';

const router = express.Router();

router.post('/submit', submitPartnerForm); // <-- Eita add karidiyantu
router.get('/all', getAllPartners);        // <-- Admin list pain

export default router;