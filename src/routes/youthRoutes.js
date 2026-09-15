import express from "express";
// FIXED: folder name 'middleware' (singular) hisabe import path update hela
import upload from "../middleware/upload.js"; 
import {
    getAllYouth,
    createYouth,
    updateYouth,
    deleteYouth,
} from "../controllers/youthController.js";

const router = express.Router();

router.get("/", getAllYouth);
router.post("/", upload.any(), createYouth);
router.put("/:id", upload.any(), updateYouth);
router.delete("/:id", deleteYouth);

export default router;