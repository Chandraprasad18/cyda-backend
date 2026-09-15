import express from "express";
import { 
  getDonateDetails, 
  saveOrUpdateDonate, 
  deleteDonateDetails 
} from "../controllers/donateController.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();

router.get("/", getDonateDetails);
router.post("/", upload.single("coverImage"), saveOrUpdateDonate);
router.post("/:id", upload.single("coverImage"), saveOrUpdateDonate); // Edit/Update route with ID
router.delete("/:id", deleteDonateDetails); // Delete route with ID

export default router;