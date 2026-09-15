import YouthHero from '../models/youthHeroModel.js';

// ସେକ୍ସନ୍ ନାମ ଅନୁସାରେ ହିରୋ ଡାଟା ଆଣିବା ପାଇଁ (GET)
export const getHeroBySection = async (req, res) => {
    try {
        const { sectionName } = req.params;
        if (!sectionName) {
            return res.status(400).json({ success: false, message: "Section name is required" });
        }

        const heroData = await YouthHero.findOne({ sectionName: sectionName.toLowerCase() });

        if (!heroData) {
            return res.status(404).json({ success: false, message: "Hero section data not found" });
        }

        res.status(200).json({ success: true, data: heroData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ନୂତନ ହିରୋ ଡାଟା ଯୋଡ଼ିବା କିମ୍ବା ଅପଡେଟ୍ କରିବା ପାଇଁ (POST / Upsert)
export const upsertHeroData = async (req, res) => {
    try {
        // ଏଠାରେ section କିମ୍ବା sectionName ଯେକୌଣସି ଗୋଟିଏ ଆସିଲେ ଏହାକୁ ଗ୍ରହଣ କରିବ
        const section = req.body?.section || req.body?.sectionName;
        
        if (!section) {
            return res.status(400).json({ success: false, message: "Section name is missing in request body" });
        }

        const { youthHeading, existingCards, existingCoverImage } = req.body;
        const updateData = { youthHeading };
        
        // କଭର୍ ଇମେଜ୍ ଯାଞ୍ଚ
        if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
            updateData.coverImage = `uploads/${req.files.coverImage[0].filename}`;
        } else if (existingCoverImage) {
            updateData.coverImage = existingCoverImage;
        }

        // କାର୍ଡଗୁଡ଼ିକର ତଥ୍ୟ ପାର୍ସ କରିବା
        let parsedCards = [];
        if (existingCards) {
            try {
                parsedCards = JSON.parse(existingCards);
            } catch (err) {
                console.error("Error parsing existingCards:", err);
            }
        }

        // ପ୍ରତ୍ୟେକ କାର୍ଡର ଫାଇଲ୍ ଅପଲୋଡ୍ ମ୍ୟାପ୍ କରିବା
        if (parsedCards.length > 0) {
            parsedCards.forEach((card, index) => {
                const fileKey = `cardImage_${index}`;
                if (req.files && req.files[fileKey] && req.files[fileKey].length > 0) {
                    card.image = `uploads/${req.files[fileKey][0].filename}`;
                }
            });
        }

        updateData.imageContentArray = parsedCards;

        const updatedHero = await YouthHero.findOneAndUpdate(
            { sectionName: section.toLowerCase() },
            { $set: updateData },
            { returnDocument: 'after', upsert: true }
        );

        res.status(200).json({ 
            success: true, 
            message: "Data saved successfully", 
            data: updatedHero 
        });
    } catch (error) {
        console.error("Error in upsertHeroData:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};