import ProgramData from '../models/programDataModel.js';

// କାଟେଗୋରୀ ଅନୁସାରେ ଡାଟା ଆଣିବା
export const getProgramDataByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const formattedCategory = category.toLowerCase().trim();

        const data = await ProgramData.findOne({ category: formattedCategory });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `No data found for category: ${category}`
            });
        }

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error("Get Program Data Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// ଡାଟା ଇନସର୍ଟ କିମ୍ବା ଅପଡେଟ୍ (Upsert)
export const upsertProgramData = async (req, res) => {
    try {
        const { category, intro, imageContentArray } = req.body;
        const formattedCategory = category.toLowerCase().trim();

        if (!imageContentArray || imageContentArray.length === 0) {
            return res.status(400).json({
                success: false,
                message: "imageContentArray is required and cannot be empty"
            });
        }

        const updatedData = await ProgramData.findOneAndUpdate(
            { category: formattedCategory },
            { 
                intro,
                imageContentArray 
            },
            { 
                new: true, 
                upsert: true, 
                runValidators: true,
                context: 'query'
            }
        );

        res.status(200).json({
            success: true,
            message: `Data saved successfully for ${category}`,
            data: updatedData
        });
    } catch (error) {
        console.error("Upsert Program Data Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save data",
            error: error.message
        });
    }
};

// ସମସ୍ତ କାଟେଗୋରୀ ଡାଟା ଆଣିବା (Admin ପାଇଁ)
export const getAllProgramData = async (req, res) => {
    try {
        const allData = await ProgramData.find();
        
        res.status(200).json({
            success: true,
            count: allData.length,
            data: allData
        });
    } catch (error) {
        console.error("Get All Program Data Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};