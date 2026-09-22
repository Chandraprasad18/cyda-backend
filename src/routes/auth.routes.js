import express from 'express';
import { adminRegister, adminLogin, resetAdminPassword, superAdminResetPassword } from '../controllers/auth.js';
import { verifySuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.get('/reset-password', resetAdminPassword); 

// Super Admin password reset route (Protected by your middleware)
router.post('/super-reset-password', verifySuperAdmin, superAdminResetPassword);

export default router;