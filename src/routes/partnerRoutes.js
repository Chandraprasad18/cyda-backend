import express from 'express';
import multer from 'multer';
import { getPartners, createPartner, updatePartner, deletePartner } from '../controllers/PartnerController.js';

const router = express.Router();

// Multer storage config ଫଟୋ ଅପଲୋଡ୍ ପାଇଁ
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', getPartners);
router.post('/', upload.single('logo'), createPartner);
router.put('/:id', upload.single('logo'), updatePartner);
router.delete('/:id', deletePartner);

export default router;