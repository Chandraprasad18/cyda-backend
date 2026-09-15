import Youth from '../models/youthModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET ALL
export const getAllYouth = async (req, res) => {
    try {
        const youthData = await Youth.find();
        res.status(200).json({ success: true, data: youthData });
    } catch (error) {
        console.error("GET YOUTH ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// CREATE
export const createYouth = async (req, res) => {
    try {
        const { youthHeading } = req.body;
        
        let coverImage = '';
        if (req.file) {
            coverImage = req.file.filename;
        } else if (req.files && req.files.length > 0) {
            coverImage = req.files[0].filename;
        }

        const newYouth = new Youth({
            youthHeading,
            coverImage
        });

        await newYouth.save();
        res.status(201).json({ success: true, data: newYouth });
    } catch (error) {
        console.error("CREATE YOUTH ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE
export const updateYouth = async (req, res) => {
    try {
        const { id } = req.params;
        const youthHeading = req.body.youthHeading || req.body.title;

        const existingYouth = await Youth.findById(id);
        if (!existingYouth) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        let coverImage = existingYouth.coverImage;
        const incomingFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

        if (incomingFile && incomingFile.filename) {
            if (existingYouth.coverImage) {
                const oldImagePath = path.join(__dirname, "..", "..", "uploads", existingYouth.coverImage);
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                    }
                }
            }
            coverImage = incomingFile.filename;
        }

        const updatedYouth = await Youth.findByIdAndUpdate(
            id,
            { youthHeading, coverImage },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedYouth });
    } catch (error) {
        console.error("UPDATE YOUTH ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
export const deleteYouth = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedYouth = await Youth.findByIdAndDelete(id);
        
        if (deletedYouth && deletedYouth.coverImage) {
            const imagePath = path.join(__dirname, "..", "..", "uploads", deletedYouth.coverImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        console.error("DELETE YOUTH ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};