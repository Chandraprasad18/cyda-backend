import express from 'express';
import { getSocialChangeData, updateSocialChangeData } from '../controllers/socialChangeController.js';
import upload from '../middleware/upload.js';
import SocialChange from '../models/socialChangeModel.js'; // 👈 Aei import line ti add karidiyantu

const router = express.Router();

router.get('/', getSocialChangeData);
router.put('/', upload.single('image'), updateSocialChangeData);

// DELETE route
router.delete('/', async (req, res) => {
    try {
        await SocialChange.findOneAndDelete({});
        res.status(200).json({ success: true, message: "Social Change content deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;