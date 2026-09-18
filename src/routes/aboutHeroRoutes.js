import express from "express";
import upload from "../middleware/upload.js";
import { 
    getAboutHeroData, 
    createAboutHeroData, 
    updateAboutHeroData, 
    deleteAboutHeroData 
} from "../controllers/aboutHeroController.js";

const router = express.Router();

router.get("/", getAboutHeroData);
router.post("/", upload.single("image"), createAboutHeroData);
router.put("/:id", upload.single("image"), updateAboutHeroData);
router.delete("/:id", deleteAboutHeroData);

export default router;