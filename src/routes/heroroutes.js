import express from "express";
import { 
    getHeroContactData, 
    createHeroContactData, 
    updateHeroContactData, 
    deleteHeroContactData 
} from "../controllers/herocontroller.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();

router.get("/", getHeroContactData);
router.post("/", upload.single("coverImage"), createHeroContactData);
router.put("/:id", upload.single("coverImage"), updateHeroContactData);
router.delete("/:id", deleteHeroContactData);

export default router;