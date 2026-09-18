import AboutHero from "../models/aboutHeroModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get All About Hero Data
export const getAboutHeroData = async (req, res) => {
    try {
        const data = await AboutHero.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create About Hero Data
export const createAboutHeroData = async (req, res) => {
    try {
        const { headingLine1, headingLine2, boldText, description } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imageUrl = `uploads/${req.file.filename}`;

        const newData = new AboutHero({
            headingLine1,
            headingLine2,
            boldText,
            description,
            imageUrl
        });

        await newData.save();
        res.status(201).json({ success: true, message: "Created successfully", data: newData });
    } catch (error) {
        if (req.file) {
            const filePath = path.join(__dirname, "..", "..", "uploads", req.file.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update About Hero Data (Fixed to retain old image if no new file is uploaded)
export const updateAboutHeroData = async (req, res) => {
    try {
        const { id } = req.params;
        const { headingLine1, headingLine2, boldText, description } = req.body;

        const existingData = await AboutHero.findById(id);
        if (!existingData) {
            if (req.file) {
                const newFilePath = path.join(__dirname, "..", "..", "uploads", req.file.filename);
                if (fs.existsSync(newFilePath)) fs.unlinkSync(newFilePath);
            }
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        let imageUrl = existingData.imageUrl;
        if (req.file) {
            if (existingData.imageUrl) {
                const oldPath = path.join(__dirname, "..", "..", existingData.imageUrl);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            imageUrl = `uploads/${req.file.filename}`;
        }

        const updatedData = await AboutHero.findByIdAndUpdate(
            id,
            { headingLine1, headingLine2, boldText, description, imageUrl },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: "Updated successfully", data: updatedData });
    } catch (error) {
        if (req.file) {
            const newFilePath = path.join(__dirname, "..", "..", "uploads", req.file.filename);
            if (fs.existsSync(newFilePath)) fs.unlinkSync(newFilePath);
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete About Hero Data
export const deleteAboutHeroData = async (req, res) => {
    try {
        const { id } = req.params;
        const existingData = await AboutHero.findById(id);
        if (!existingData) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        if (existingData.imageUrl) {
            const imagePath = path.join(__dirname, "..", "..", existingData.imageUrl);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        await AboutHero.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};