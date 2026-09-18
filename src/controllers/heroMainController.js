import HeroMain from "../models/HeroMainModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Hero Image By Section
export const getHeroBySection = async (req, res) => {
    try {
        const { section } = req.params;
        const targetSection = section.toLowerCase().trim();
        
        const data = await HeroMain.findOne({ 
            sectionKey: targetSection 
        });

        if (!data) {
            return res.status(200).json({ success: false, message: "Data not found" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Upsert Hero Image (Create / Update) - FIXED
export const upsertHeroData = async (req, res) => {
    try {
        const { section } = req.params;
        const { sectionKey } = req.body;
        const targetSectionKey = (sectionKey || section).toLowerCase().trim();

        const existingData = await HeroMain.findOne({ sectionKey: targetSectionKey });

        let coverImage = existingData ? existingData.coverImage : "";

        if (req.file) {
            // Remove old physical file if exists
            if (existingData && existingData.coverImage) {
                const oldPath = path.join(__dirname, "..", "..", existingData.coverImage);
                if (fs.existsSync(oldPath)) {
                    try { fs.unlinkSync(oldPath); } catch (err) { console.error(err); }
                }
            }
            coverImage = `/uploads/${req.file.filename}`;
        }

        const updated = await HeroMain.findOneAndUpdate(
            { sectionKey: targetSectionKey },
            { sectionKey: targetSectionKey, coverImage },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, message: "Hero image saved successfully!", data: updated });
    } catch (error) {
        if (req.file) {
            const newFilePath = path.join(__dirname, "..", "..", "uploads", req.file.filename);
            if (fs.existsSync(newFilePath)) {
                try { fs.unlinkSync(newFilePath); } catch (err) { console.error(err); }
            }
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Hero Data By Section
export const deleteHeroBySection = async (req, res) => {
    try {
        const { section } = req.params;
        const targetSection = section.toLowerCase().trim();

        const existingData = await HeroMain.findOne({ sectionKey: targetSection });
        if (!existingData) {
            return res.status(200).json({ success: false, name: "Section data not found to delete" });
        }

        if (existingData.coverImage) {
            const imagePath = path.join(__dirname, "..", "..", existingData.coverImage);
            if (fs.existsSync(imagePath)) {
                try { fs.unlinkSync(imagePath); } catch (err) { console.error(err); }
            }
        }

        await HeroMain.findOneAndDelete({ sectionKey: targetSection });
        res.status(200).json({ success: true, message: "Section deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};