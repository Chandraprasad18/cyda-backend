import StoryHero from "../models/storyHeroModel.js";

// Get Story Hero Data
export const getStoryHero = async (req, res) => {
    try {
        const data = await StoryHero.findOne();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create or Update Story Hero Data
export const saveStoryHero = async (req, res) => {
    try {
        const { youthHeading, imageContentArray } = req.body;
        
        let coverImage = req.files?.coverImage ? req.files.coverImage[0].filename : undefined;

        let parsedImageContentArray = imageContentArray ? JSON.parse(imageContentArray) : [];

        // Handle nested images if uploaded via multer files object
        if (req.files && req.files.cardImages) {
            let fileIndex = 0;
            parsedImageContentArray = parsedImageContentArray.map((item) => {
                if (item.hasNewImage && req.files.cardImages[fileIndex]) {
                    item.image = req.files.cardImages[fileIndex].filename;
                    fileIndex++;
                }
                return item;
            });
        }

        let storyHero = await StoryHero.findOne();

        if (storyHero) {
            if (!coverImage) coverImage = storyHero.coverImage;
            storyHero = await StoryHero.findOneAndUpdate(
                {},
                { youthHeading, coverImage, imageContentArray: parsedImageContentArray },
                { new: true }
            );
        } else {
            storyHero = await StoryHero.create({
                youthHeading,
                coverImage: coverImage || "",
                imageContentArray: parsedImageContentArray
            });
        }

        res.status(200).json({ success: true, message: "Saved successfully", data: storyHero });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};