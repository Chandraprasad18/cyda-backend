import ReportSection from "../models/reportSectionModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Reports by Category or All
export const getReportSections = async (req, res) => {
    try {
        const { category } = req.query;
        let query = category ? { category } : {};
        const reports = await ReportSection.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Report
export const createReportSection = async (req, res) => {
    try {
        const { category, year } = req.body;
        const reportUrl = req.file ? `uploads/${req.file.filename}` : "";

        if (!reportUrl) {
            return res.status(400).json({ success: false, message: "Report file is required" });
        }

        const newReport = new ReportSection({
            category,
            year,
            reportUrl
        });

        await newReport.save();
        res.status(201).json({ success: true, message: "Report created successfully", data: newReport });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Report
export const updateReportSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, year } = req.body;

        const existingReport = await ReportSection.findById(id);
        if (!existingReport) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        let reportUrl = existingReport.reportUrl;
        if (req.file) {
            if (existingReport.reportUrl) {
                const oldPath = path.join(__dirname, "..", "..", existingReport.reportUrl);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            reportUrl = `uploads/${req.file.filename}`;
        }

        const updatedReport = await ReportSection.findByIdAndUpdate(
            id,
            { category, year, reportUrl },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Report updated successfully", data: updatedReport });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Report
export const deleteReportSection = async (req, res) => {
    try {
        const { id } = req.params;
        const existingReport = await ReportSection.findById(id);
        if (!existingReport) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        if (existingReport.reportUrl) {
            const filePath = path.join(__dirname, "..", "..", existingReport.reportUrl);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await ReportSection.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};