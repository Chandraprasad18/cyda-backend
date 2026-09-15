import express from "express";
import { 
    getDataByKey, 
    updateOrCreateData 
} from "../controllers/datacontroller.js";

const router = express.Router();

// Correct route mappings (server.js re already /api/content prefix lagithibaru eithi kevala /:sectionKey au /update rahiba)
router.get("/:sectionKey", getDataByKey);
router.put("/update", updateOrCreateData);

export default router;