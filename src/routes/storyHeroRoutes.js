import express from "express";
import multer from "multer";
import path from "path";
import { getStoryHero, saveStoryHero } from "../controllers/storyHeroController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get("/", getStoryHero);
router.post(
    "/",
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "cardImages", maxCount: 20 }
    ]),
    saveStoryHero
);

export default router;