import mongoose from "mongoose";

const reportSectionSchema = new mongoose.Schema({
    category: { type: String, required: true }, // e.g., "annual", "financial", "audit"
    year: { type: String, required: true },     // e.g., "2025-2026"
    reportUrl: { type: String, required: true } // PDF file path
}, { timestamps: true });

export default mongoose.model("ReportSection", reportSectionSchema);