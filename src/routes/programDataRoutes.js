import express from 'express';
import { 
    getProgramDataByCategory, 
    upsertProgramData,
    getAllProgramData 
} from '../controllers/programDataController.js';

const router = express.Router();

router.get('/all', getAllProgramData);
router.post('/save', upsertProgramData);
router.get('/:category', getProgramDataByCategory);

// ଏହି ଲାଇନ୍ ଟି ନିଶ୍ଚିତ ଭାବେ ରହିବା ଦରକାର:
export default router;