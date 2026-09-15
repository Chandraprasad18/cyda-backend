import express from "express";
import upload from "../middleware/upload.js"; 
import {
    getPrograms,
    getProgramById,
    getProgramByCategory,
    createProgram,
    updateProgram,
    deleteProgram
} from "../controllers/NewProgramController.js"; 

const router = express.Router();

router.get("/", getPrograms);
router.get("/category/:categoryName", getProgramByCategory);
router.get("/:id", getProgramById);

router.post("/", upload.single('uploadedImage'), (req, res, next) => {
    if (req.file || req.isMultipart || Object.keys(req.body).length > 0) {
        req.isFormData = true;
    }
    next();
}, createProgram);

router.put("/:id", upload.single('uploadedImage'), updateProgram);

// ଡିଲିଟ୍ ରାଉଟ୍ (ଉଭୟ ପୂରା ଡକ୍ୟୁମେଣ୍ଟ୍ ବା ନିର୍ଦ୍ଦିଷ୍ଟ ସବ୍-ଆଇଟମ୍ ପାଇଁ କାମ କରିବ)
router.delete("/:id", deleteProgram);

export default router;