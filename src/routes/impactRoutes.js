import express from 'express';
import multer from 'multer';
import { getImpacts, createImpact, updateImpact, deleteImpact } from '../controllers/ImpactController.js';

const router = express.Router();

// ଫଟୋ ସେଭ୍ ହେବା ପାଇଁ Multer କନଫିଗ୍ରେସନ୍
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', getImpacts);
router.post('/', upload.single('imagePath'), createImpact);
router.put('/:id', upload.single('imagePath'), updateImpact);
router.delete('/:id', deleteImpact);

export default router;