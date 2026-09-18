import express from 'express';
import { getAnnualReports, updateAnnualReports } from '../controllers/newAnnualController.js';

const router = express.Router();

router.get('/', getAnnualReports);
router.put('/', updateAnnualReports);

export default router;