import CategoryContent from "../models/Newmodel.js";

// ସମସ୍ତ ଡାଟା ଲିଷ୍ଟ୍ ଆଣିବା (Table View ପାଇଁ)
export const getAllCategories = async (req, res) => {
    try {
        const allData = await CategoryContent.find();
        res.status(200).json({ success: true, data: allData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ନାମ ଅନୁସାରେ ଡାଟା ଫେଚ୍ କରିବା (Get Data)
export const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const categoryData = await CategoryContent.findOne({ name });

        if (!categoryData) {
            return res.status(404).json({ 
                success: false, 
                message: "ଏହି ନାମରେ କୌଣସି ଡାଟା ମିଳିଲା ନାହିଁ।" 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: categoryData 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// ଆଡମିନ୍ ପ୍ୟାନେଲ୍‌ରୁ ଡାଟା ଅପ୍‌ଡେଟ୍ କିମ୍ବା କ୍ରିଏଟ୍ କରିବା (Update/Create - Upsert)
export const upsertCategoryData = async (req, res) => {
    try {
        const { name } = req.params;
        const { title, firstHead, boldParaContent, normalParagraph } = req.body;

        // ପ୍ରଥମେ ଡାଟାବେସ୍‌ରୁ ପୁରୁଣା ଡାଟା ଚେକ୍ କରନ୍ତୁ
        const existingData = await CategoryContent.findOne({ name });

        // ଯଦି ନୂଆ ଫାଇଲ୍ ଆସିଥାଏ, ତେବେ ନୂଆ ପାଥ୍ ନିଅନ୍ତୁ; ନହେଲେ ପୁରୁଣା ଇମେଜ୍ ବା ଖାଲି ଛାଡ଼ନ୍ତୁ
        let imagePath = existingData ? existingData.image : "";
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const updateDataPayload = { 
            title, 
            firstHead, 
            boldParaContent, 
            normalParagraph 
        };

        // ଯଦି imagePath ଥାଏ, କେବଳ ତେବେ ହିଁ ଅବଜେକ୍ଟରେ ଇମେଜ୍ ଯୋଡ଼ନ୍ତୁ
        if (imagePath) {
            updateDataPayload.image = imagePath;
        }

        const updatedData = await CategoryContent.findOneAndUpdate(
            { name },
            updateDataPayload,
            { new: true, upsert: true }
        );

        res.status(200).json({ 
            success: true, 
            message: "ସଫଳତାର ସହ ସେଭ୍/ଅପ୍‌ଡେଟ୍ ହୋଇଗଲା!", 
            data: updatedData 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// 🔴 ନାମ ଅନୁସାରେ ଡାଟା ଡିଲିଟ୍ କରିବା ପାଇଁ ଫଙ୍କସନ୍
export const deleteCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const deletedData = await CategoryContent.findOneAndDelete({ name });

        if (!deletedData) {
            return res.status(404).json({ 
                success: false, 
                message: "ଡିଲିଟ୍ କରିବା ପାଇଁ ଏହି ନାମରେ କୌଣସି ଡାଟା ମିଳିଲା ନାହିଁ।" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "ଡାଟା ସଫଳତାର ସହ ଡିଲିଟ୍ ହୋଇଗଲା!" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};