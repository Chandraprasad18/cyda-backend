import PolicyItem from '../models/policyItemsModules.js';

// ସମସ୍ତ ପଲିସି ଫେଚ୍ କରିବା ପାଇଁ
export const getPolicies = async (req, res) => {
    try {
        const policies = await PolicyItem.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: { policies } // ଫ୍ରଣ୍ଟଏଣ୍ଡ୍ structure ସହ ମେଳ କରାଗଲା
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ଆଡମିନ୍ ପ୍ୟାନେଲରୁ ପଲିସି ତଥା PDF ଅପ୍‌ଲୋଡ୍ / ଅପ୍‌ଡେଟ୍ କରିବା ପାଇଁ (Upsert logic)
export const createPolicy = async (req, res) => {
    try {
        const { title } = req.body;
        const policyFile = req.file ? req.file.path.replace(/\\/g, "/") : '';

        if (!title) {
            return res.status(400).json({ success: false, message: "Policy title is required" });
        }

        // ଯଦି ପଲିସି ଆଗରୁ ଅଛି ତେବେ ତାହା ଅପ୍‌ଡେଟ୍ ହୋଇଯିବ, ନହେଲେ ନୂଆ ତିଆରି ହେବ
        const updatedPolicy = await PolicyItem.findOneAndUpdate(
            { title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } }, // Case-insensitive match
            { 
                title: title.trim(),
                policyFile: policyFile,
                reportLink: policyFile,
                category: 'policies'
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({
            success: true,
            message: "Policy saved and activated successfully",
            data: updatedPolicy
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};