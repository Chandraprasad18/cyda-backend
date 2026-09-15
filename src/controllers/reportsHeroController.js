import ReportsHero from "../models/reportsHeroModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Reports Hero Data
export const getReportsHeroData = async (req, res) => {
    try {
        const data = await ReportsHero.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Reports Hero Data
export const createReportsHeroData = async (req, res) => {
    try {
        const imageUrl = req.file ? `uploads/${req.file.filename}` : "";

        const newData = new ReportsHero({
            imageUrl
        });

        await newData.save();
        res.status(201).json({ success: true, message: "Reports Hero created successfully", data: newData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Reports Hero Data
export const updateReportsHeroData = async (req, res) => {
    try {
        const { id } = req.params;

        const existingData = await ReportsHero.findById(id);
        if (!existingData) {
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

        const updatedData = await ReportsHero.findByIdAndUpdate(
            id,
            { imageUrl },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Reports Hero updated successfully", data: updatedData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Reports Hero Data
export const deleteReportsHeroData = async (req, res) => {
    try {
        const { id } = req.params;
        const existingData = await ReportsHero.findById(id);
        if (!existingData) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        if (existingData.imageUrl) {
            const imagePath = path.join(__dirname, "..", "..", existingData.imageUrl);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        await ReportsHero.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Reports Hero deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};