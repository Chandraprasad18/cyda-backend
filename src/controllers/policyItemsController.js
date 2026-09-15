import PolicyItem from '../models/policyItemsModules.js';

// Get all policies
export const getPolicies = async (req, res) => {
    try {
        const policies = await PolicyItem.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: policies
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create a new policy (Admin Panel use kariba)
export const createPolicy = async (req, res) => {
    try {
        const { title } = req.body;
        // Yadi PDF file upload heba, taara path save heba, no hele empty string
        const policyFile = req.file ? req.file.path.replace(/\\/g, "/") : '';

        const newPolicy = new PolicyItem({
            title,
            policyFile
        });

        await newPolicy.save();
        res.status(201).json({
            success: true,
            message: "Policy created successfully",
            data: newPolicy
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};