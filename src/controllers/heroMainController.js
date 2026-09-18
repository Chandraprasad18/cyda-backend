import HeroMain from "../models/HeroMainModel.js";

// Get Hero Image By Section
export const getHeroBySection = async (req, res) => {
    try {
        const { section } = req.params;
        const targetSection = section.toLowerCase().trim();
        
        const data = await HeroMain.findOne({ 
            sectionKey: targetSection 
        });

        if (!data) {
            return res.status(200).json({ success: false, message: "Data not found" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Upsert Hero Image (Create / Update) - Cloudinary Ready
export const upsertHeroData = async (req, res) => {
    try {
        const { section } = req.params;
        const { sectionKey } = req.body;
        const targetSectionKey = (sectionKey || section).toLowerCase().trim();

        const existingData = await HeroMain.findOne({ sectionKey: targetSectionKey });

        let coverImage = existingData ? existingData.coverImage : "";

        // ଯଦି ନୂଆ ଫାଇଲ୍ ଅପଲୋଡ୍ ହୋଇଥାଏ, ତେବେ ତାହାର Cloudinary URL (req.file.path) ନେବ
        if (req.file) {
            coverImage = req.file.path || req.file.secure_url;
        }

        const updated = await HeroMain.findOneAndUpdate(
            { sectionKey: targetSectionKey },
            { sectionKey: targetSectionKey, coverImage },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, message: "Hero image saved successfully!", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Hero Data By Section
export const deleteHeroBySection = async (req, res) => {
    try {
        const { section } = req.params;
        const targetSection = section.toLowerCase().trim();

        const existingData = await HeroMain.findOne({ sectionKey: targetSection });
        if (!existingData) {
            return res.status(200).json({ success: false, name: "Section data not found to delete" });
        }

        await HeroMain.findOneAndDelete({ sectionKey: targetSection });
        res.status(200).json({ success: true, message: "Section deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};