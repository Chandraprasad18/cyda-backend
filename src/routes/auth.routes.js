import express from 'express';
import { adminRegister, adminLogin } from '../controllers/auth.js'; // ✅ Ete '../controllers/auth.js' karidiyantu

const router = express.Router();

router.post('/register', adminRegister);
router.post('/login', adminLogin);

export default router;