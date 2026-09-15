import Donate from "../models/donateModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get All Donate Details
export const getDonateDetails = async (req, res, next) => {
  try {
    const donateData = await Donate.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: donateData || [],
    });
  } catch (error) {
    next(error);
  }
};

// Create or Update Donate Details (Supports multiple records & ID-based updates)
export const saveOrUpdateDonate = async (req, res, next) => {
  try {
    const { id } = req.params; // ଯଦି ଏଡିଟ୍ ସମୟରେ ID ଆସେ
    const { headline, mainHeading, subHeading, donationOptions } = req.body;
    let updateData = { 
      headline, 
      mainHeading, 
      subHeading 
    };

    // Safe JSON parse for donationOptions
    if (donationOptions) {
      if (typeof donationOptions === 'string') {
        try {
          updateData.donationOptions = JSON.parse(donationOptions);
        } catch (err) {
          updateData.donationOptions = [
            { amount: 10000, purpose: "For Sponsor Education of 1 Child" },
            { amount: 5000, purpose: "Skill Development and Entrepreneurship" },
            { amount: 5000, purpose: "Livelihood" },
            { amount: 1000, purpose: "For Youth Resource Centre" }
          ];
        }
      } else {
        updateData.donationOptions = donationOptions;
      }
    }

    let donateData;

    if (req.file) {
      updateData.coverImage = req.file.filename;

      // ଯଦି ଏଡିଟ୍ ହେଉଛି, ପୁରୁଣା ଫାଇଲ୍ ଡିଲିଟ୍ କରିବା ପାଇଁ
      if (id) {
        const existingRecord = await Donate.findById(id);
        if (existingRecord && existingRecord.coverImage) {
          const oldImagePath = path.join(__dirname, "..", "uploads", existingRecord.coverImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }
    }

    if (id) {
      // Update existing record by ID
      donateData = await Donate.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      // Create new record
      donateData = await Donate.create(updateData);
    }

    res.status(200).json({
      success: true,
      message: id ? "Donate section updated successfully!" : "Donate section created successfully!",
      data: donateData,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Donate Content by ID
export const deleteDonateDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const donateData = await Donate.findById(id);
    
    if (!donateData) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }

    if (donateData.coverImage) {
      const imagePath = path.join(__dirname, "..", "uploads", donateData.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Donate.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Donate section deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};