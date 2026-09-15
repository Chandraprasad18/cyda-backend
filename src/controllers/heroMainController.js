import HeroMain from "../models/HeroMainModel.js";

// Get Hero Data by Section (Case-insensitive search)
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

// Upsert Hero Data (Create / Update)
export const upsertHeroData = async (req, res) => {
    try {
        const { section } = req.params;
        const { youthHeading, sectionKey } = req.body;
        const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;

        const targetSectionKey = (sectionKey || section).toLowerCase().trim();

        const updateData = { 
            youthHeading, 
            sectionKey: targetSectionKey 
        };
        if (coverImage) updateData.coverImage = coverImage;

        const updated = await HeroMain.findOneAndUpdate(
            { sectionKey: targetSectionKey },
            updateData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, message: "Saved successfully!", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Hero Data By Section
export const deleteHeroBySection = async (req, res) => {
    try {
        const { section } = req.params;
        const targetSection = section.toLowerCase().trim();

        const deleted = await HeroMain.findOneAndDelete({
            sectionKey: targetSection
        });

        if (!deleted) {
            return res.status(200).json({ success: false, message: "Section data not found to delete" });
        }

        res.status(200).json({ success: true, message: "Section deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};