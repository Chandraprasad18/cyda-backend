import express from 'express';
import { getCategoryByName, upsertCategoryData, getAllCategories, deleteCategoryByName } from '../controllers/Newgetcontroller.js';
import CategoryContent from '../models/Newmodel.js';
import multer from 'multer';
import path from 'path';

// ଇମେଜ୍ ସେଭ୍ କରିବା ପାଇଁ Multer ସେଟିଂସ୍
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const cleanName = file.originalname.replace(/\s+/g, '-').replace(ext, '');
        cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

// ସବୁ ଡାଟା ଫେଚ୍ କରିବା ପାଇଁ (Table View ପାଇଁ ଜରୁରୀ)
router.get('/', getAllCategories);

// ନାମ ଅନୁସାରେ ଗୋଟିଏ ଡାଟା ଆଣିବା ପାଇଁ
router.get('/:name', getCategoryByName);

// Create କିମ୍ବା Update କରିବା ପାଇଁ
router.put('/update/:name', upload.single('image'), upsertCategoryData);
router.post('/update/:name', upload.single('image'), upsertCategoryData); 

// 🔴 ଡିଲିଟ୍ କରିବା ପାଇଁ ନୂଆ ରୁଟ୍ ଯୋଡ଼ାଗଲା
router.delete('/delete/:name', deleteCategoryByName);

export default router;