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

// Upsert Hero Image (Create / Update) - FIXED
export const upsertHeroData = async (req, res) => {
    try {
        const { section } = req.params;
        const { sectionKey } = req.body;
        const targetSectionKey = (sectionKey || section).toLowerCase().trim();

        // ପୂର୍ବରୁ ଏହି sectionKey ପାଇଁ ଡାଟା ଅଛି କି ନାହିଁ ଯାଞ୍ଚ କରନ୍ତୁ
        const existingData = await HeroMain.findOne({ sectionKey: targetSectionKey });

        const updateData = { 
            sectionKey: targetSectionKey 
        };

        // ଯଦି ନୂଆ ଫାଇଲ୍ ଅପଲୋଡ୍ ହୋଇଛି, ତେବେ ନୂଆ ପାଥ୍ ଦିଅନ୍ତୁ
        if (req.file) {
            updateData.coverImage = `/uploads/${req.file.filename}`;
        } else if (existingData && existingData.coverImage) {
            // ଯଦି ନୂଆ ଫାଇଲ୍ ନାହିଁ, କିନ୍ତୁ ପୁରୁଣା ଇମେଜ୍ ଅଛି, ତେବେ ପୁରୁଣାଟିକୁ ବଜାୟ ରଖନ୍ତୁ (Removal ରୋକିବ ପାଇଁ)
            updateData.coverImage = existingData.coverImage;
        }

        const updated = await HeroMain.findOneAndUpdate(
            { sectionKey: targetSectionKey },
            updateData,
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