import Adolescent from "../models/adolescentModel.js";
import fs from "fs";
import path from "path";

// GET Adolescent Data
export const getAdolescentData = async (req, res) => {
    try {
        const data = await Adolescent.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.error("GET ADOLESCENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load Adolescent data",
            error: error.message,
        });
    }
};

// CREATE Adolescent Data
export const createAdolescentData = async (req, res) => {
    try {
        const { heading, description } = req.body;

        if (!heading || !description) {
            return res.status(400).json({
                success: false,
                message: "Heading and description are required",
            });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = `uploads/${req.file.filename}`;
        }

        const newData = await Adolescent.create({
            heading,
            description,
            imageUrl,
        });

        return res.status(201).json({
            success: true,
            message: "Adolescent created successfully",
            data: newData,
        });
    } catch (error) {
        console.error("CREATE ADOLESCENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create Adolescent record",
            error: error.message,
        });
    }
};

// UPDATE Adolescent Data
export const updateAdolescentData = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, description } = req.body;

        const existingData = await Adolescent.findById(id);
        if (!existingData) {
            return res.status(404).json({
                success: false,
                message: "Record not found",
            });
        }

        if (heading !== undefined) existingData.heading = heading;
        if (description !== undefined) existingData.description = description;

        if (req.file) {
            // Delete old image if exists
            if (existingData.imageUrl) {
                const oldImagePath = path.join(process.cwd(), existingData.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                    } catch (err) {
                        console.error("Old image delete error:", err);
                    }
                }
            }
            existingData.imageUrl = `uploads/${req.file.filename}`;
        }

        const updatedData = await existingData.save();

        return res.status(200).json({
            success: true,
            message: "Adolescent updated successfully",
            data: updatedData,
        });
    } catch (error) {
        console.error("UPDATE ADOLESCENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update Adolescent",
            error: error.message,
        });
    }
};

// DELETE Adolescent Data
export const deleteAdolescentData = async (req, res) => {
    try {
        const { id } = req.params;
        const existingData = await Adolescent.findById(id);

        if (!existingData) {
            return res.status(404).json({
                success: false,
                message: "Record not found",
            });
        }

        if (existingData.imageUrl) {
            const imagePath = path.join(process.cwd(), existingData.imageUrl);
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                } catch (err) {
                    console.error("Image delete error:", err);
                }
            }
        }

        await Adolescent.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Deleted successfully",
            data: { id },
        });
    } catch (error) {
        console.error("DELETE ADOLESCENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete record",
            error: error.message,
        });
    }
};