import Program from '../models/programModel.js';

// ସବୁ ପ୍ରୋଗ୍ରାମ୍ କିମ୍ବା ନିର୍ଦ୍ଦିଷ୍ଟ କାଟେଗୋରୀ ଆଣିବା ପାଇଁ
export const getProgramByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const formattedCategory = category.toLowerCase().trim();

        const program = await Program.findOne({ category: formattedCategory });

        if (!program) {
            return res.status(404).json({
                success: false,
                message: `No data found for category: ${category}`
            });
        }

        res.status(200).json({
            success: true,
            data: program
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// ଡାଟାବେସ୍‌ରେ ନୂଆ ପ୍ରୋଗ୍ରାମ୍ ଡାଟା ଇନସର୍ଟ କିମ୍ବା ଅପଡେଟ୍ କରିବା ପାଇଁ (Upsert)
export const upsertProgramData = async (req, res) => {
    try {
        const { category, intro, imageContentArray } = req.body;
        const formattedCategory = category.toLowerCase().trim();

        const updatedProgram = await Program.findOneAndUpdate(
            { category: formattedCategory },
            { intro, imageContentArray },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: `Data saved successfully for ${category}`,
            data: updatedProgram
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save data",
            error: error.message
        });
    }
};