import express from "express";
import { getHeroContactData, updateHeroContactData } from "../controllers/herocontroller.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();

router.get("/", getHeroContactData);
router.post("/", upload.single("coverImage"), updateHeroContactData);

export default router;