import express from 'express';
import { getDefaultDataBySegment, updateDefaultData, deleteDefaultData } from '../controllers/getController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET data by segment (e.g. /api/default-data/youth)
router.get('/:segment', getDefaultDataBySegment);

// PUT to update or auto-create data with image upload (ସିଧାସଳଖ /:segment ରଖାଗଲା ଯେପରି ଫ୍ରଣ୍ଟଏଣ୍ଡ୍/ଆଡମିନ୍ ପ୍ୟାନେଲ୍ ସହ ମେଳ ଖାଏ)
router.put('/:segment', upload.single('image'), updateDefaultData);

// ପୁରୁଣା /update/:segment ରୁଟ୍ ମଧ୍ୟ ରଖିପାରିବେ ଯଦି କୌଣସି ପୁରୁଣା କୋଡ୍ ତାହା ବ୍ୟବହାର କରୁଥାଏ
router.put('/update/:segment', upload.single('image'), updateDefaultData);

// POST route
router.post('/:segment', upload.single('image'), updateDefaultData);

// DELETE route by segment
router.delete('/:segment', deleteDefaultData);

export default router;