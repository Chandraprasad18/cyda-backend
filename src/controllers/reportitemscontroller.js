import ReportItem from '../models/reportitemsmodules.js';

// Get reports by category
export const getReportsByCategory = async (req, res) => {
    try {
        const category = req.query.category ? req.query.category.trim().toLowerCase() : '';
        const query = category ? { category } : {};
        const reports = await ReportItem.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create new report (Admin panel use kariba)
export const createReport = async (req, res) => {
    try {
        const { category, year } = req.body;
        const reportUrl = req.file ? req.file.path.replace(/\\/g, "/") : '';

        const newReport = new ReportItem({
            category: category ? category.trim().toLowerCase() : '',
            year,
            reportUrl
        });

        await newReport.save();
        res.status(201).json({
            success: true,
            message: "Report created successfully",
            data: newReport
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};