import ReportSection from "../models/reportSectionModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get All Reports
export const getReportSections = async (req, res) => {
    try {
        const reports = await ReportSection.find({}).sort({ createdAt: -1 });
        // Group by category to support frontend expectations
        const grouped = reports.reduce((acc, report) => {
            if (!acc[report.category]) acc[report.category] = [];
            acc[report.category].push(report);
            return acc;
        }, {});
        res.status(200).json({ success: true, data: grouped });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Reports by specific Category
export const getReportsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const reports = await ReportSection.find({ category }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Bulk Update / Replace by Category (Used by Admin Panel) - 🛑 ସଂଶୋଧିତ କୋଡ୍
export const updateReportsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const items = JSON.parse(req.body.items || "[]");
        const files = req.files || [];

        // ଫାଇଲ୍‌ଗୁଡ଼ିକୁ ମୂଳ ନାମ (Original Name) କିମ୍ବା ଇଣ୍ଡେକ୍ସ ଆଧାରରେ ମ୍ୟାପ୍ କରିବା
        let fileMap = {};
        files.forEach((file) => {
            fileMap[file.originalname] = `uploads/${file.filename}`;
        });

        // ପୁରଣା ଡକୁମେଣ୍ଟଗୁଡ଼ିକୁ ଡିଲିଟ୍ କରିବା
        await ReportSection.deleteMany({ category });

        const newDocs = items.map((item, idx) => {
            let reportUrl = item.reportLink || "";
            
            // ଯଦି ଫ୍ରଣ୍ଟଏଣ୍ଡ୍ ପଠାଇଥିବା ଫାଇଲ୍ ନାମ ଫାଇଲ୍ ମ୍ୟାପ୍‌ରେ ଥାଏ ବା ଇଣ୍ଡେକ୍ସ ମ୍ୟାଚ୍ କରେ
            if (item.reportLink && fileMap[item.reportLink]) {
                reportUrl = fileMap[item.reportLink];
            } else if (files[idx]) {
                reportUrl = `uploads/${files[idx].filename}`;
            }

            return {
                category,
                year: item.year || "",
                title: item.title || "",
                reportUrl: reportUrl // ଡାଟାବେସ୍ ଫିଲ୍ଡ ନାମ reportUrl ଅଟେ
            };
        });

        if (newDocs.length > 0) {
            await ReportSection.insertMany(newDocs);
        }

        res.status(200).json({ success: true, message: "Reports updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Single Report
export const createReportSection = async (req, res) => {
    try {
        const { category, year, title } = req.body;
        const reportUrl = req.file ? `uploads/${req.file.filename}` : "";

        if (!reportUrl) {
            return res.status(400).json({ success: false, message: "Report file is required" });
        }

        const newReport = new ReportSection({
            category: category || "annualReports",
            year: year || "",
            title: title || "",
            reportUrl
        });

        await newReport.save();
        res.status(201).json({ success: true, message: "Report created successfully", data: newReport });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Single Report
export const updateReportSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, year, title } = req.body;

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
            { category, year, title, reportUrl },
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