import express from 'express';
import multer from 'multer';
import { getPolicies, createPolicy } from '../controllers/policyItemsController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', getPolicies);
router.post('/', upload.single('policyFile'), createPolicy);

export default router;