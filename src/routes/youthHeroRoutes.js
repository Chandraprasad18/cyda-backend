import express from 'express';
import multer from 'multer';
import { getHeroBySection, upsertHeroData } from '../controllers/youthHeroController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// ସମସ୍ତ କଭର୍ ଏବଂ କାର୍ଡ ଇମେଜ୍ ଗୁଡ଼ିକୁ ହ୍ୟାଣ୍ଡେଲ୍ କରିବା ପାଇଁ upload.any() ବ୍ୟବହାର କରାଗଲା
router.post('/save', upload.any(), upsertHeroData);

router.get('/adolescent', (req, res, next) => {
    req.params.sectionName = 'adolescent';
    return getHeroBySection(req, res, next);
});

router.get('/gender', (req, res, next) => {
    req.params.sectionName = 'gender';
    return getHeroBySection(req, res, next);
});

router.get('/socialchange', (req, res, next) => {
    req.params.sectionName = 'socialchange';
    return getHeroBySection(req, res, next);
});

router.get('/youth', (req, res, next) => {
    req.params.sectionName = 'youth';
    return getHeroBySection(req, res, next);
});

router.get('/:sectionName', getHeroBySection);

export default router;