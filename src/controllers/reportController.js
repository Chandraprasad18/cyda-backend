import Report from '../models/reportModel.js';
import path from 'path';

// Sabu reports au policies fetch kariba (GET /api/reports)
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find();
        
        const formattedData = {
            annualReports: [],
            auditReports: [],
            strategicPlan: [],
            policies: []
        };

        reports.forEach(doc => {
            if (doc.category === 'annualReports') formattedData.annualReports = doc.items;
            if (doc.category === 'auditReports') formattedData.auditReports = doc.items;
            if (doc.category === 'strategicPlan') formattedData.strategicPlan = doc.items;
            if (doc.category === 'policies') formattedData.policies = doc.items;
        });

        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Report ba Policy category update ba create kariba (PUT /api/reports/:category)
export const updateOrCreateReportCategory = async (req, res) => {
    try {
        const { category } = req.params;
        let items = [];

        if (req.body.items) {
            items = typeof req.body.items === 'string' ? JSON.parse(req.body.items) : req.body.items;
        } else if (req.body.title) {
            const titles = Array.isArray(req.body.title) ? req.body.title : [req.body.title];
            items = titles.map((title) => ({
                title: title,
                reportLink: ''
            }));
        }

        // Handle file uploads cleanly
        if (req.files && req.files.length > 0) {
            req.files.forEach((file, fileIndex) => {
                // Keep only the filename or clean relative path to avoid double uploads/
                const cleanFileName = file.filename; 
                
                const targetIndex = req.body[`fileIndex_${file.fieldname}`] !== undefined 
                    ? Number(req.body[`fileIndex_${file.fieldname}`]) 
                    : fileIndex;

                if (items[targetIndex]) {
                    items[targetIndex].reportLink = cleanFileName;
                }
            });
        }

        // Clean existing items reportLinks if they accidentally contain full paths
        items = items.map(item => {
            if (item.reportLink) {
                // Remove any leading uploads/ or full urls if present
                const fileName = item.reportLink.replace(/^.*[\\\/]/, '');
                return { ...item, reportLink: fileName };
            }
            return item;
        });

        const allowedCategories = ['annualReports', 'auditReports', 'strategicPlan', 'policies'];
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ success: false, message: "Invalid category name" });
        }

        const updatedReport = await Report.findOneAndUpdate(
            { category },
            { items },
            { new: true, upsert: true }
        );

        res.status(200).json({ 
            success: true, 
            message: `${category} updated successfully`, 
            data: updatedReport 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};