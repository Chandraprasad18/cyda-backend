import mongoose from "mongoose";

const reportSectionSchema = new mongoose.Schema({
    category: { type: String, required: true }, // e.g., "annualReports", "auditReports", "strategicPlan", "policies"
    year: { type: String, required: false },    // e.g., "2025-2026"
    title: { type: String, required: false },   // e.g., Policy Title
    reportUrl: { type: String, required: true } // PDF file path
}, { timestamps: true });

export default mongoose.model("ReportSection", reportSectionSchema);