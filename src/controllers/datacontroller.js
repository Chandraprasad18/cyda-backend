import DynamicContent from "../models/datamodel.js";

// 1. Get Data by Section Key
export const getDataByKey = async (req, res) => {
    try {
        const { sectionKey } = req.params;
        const record = await DynamicContent.findOne({ sectionKey });
        
        if (!record) {
            return res.status(404).json({ success: false, message: "Data milila nahi!" });
        }
        
        res.status(200).json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Update or Create Data
export const updateOrCreateData = async (req, res) => {
    try {
        const { sectionKey, intro, imageContentArray } = req.body;

        const updatedRecord = await DynamicContent.findOneAndUpdate(
            { sectionKey },
            { intro, imageContentArray },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Data successfully update heigala!",
            data: updatedRecord
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};