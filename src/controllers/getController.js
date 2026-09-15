import GetModel from '../models/getModel.js';

// Website pain segment anujayi data aniba
export const getDefaultDataBySegment = async (req, res, next) => {
    try {
        const { segment } = req.params;
        let content = await GetModel.findOne({ segment });

        // Data na thile 404 badle 200 OK sahita null pathauchi, jeemitiki frontend table crash heba nahi
        if (!content) {
            return res.status(200).json({ success: false, message: "Content not found!", data: null });
        }

        res.status(200).json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

// Admin panel ru content au image update kariba (With Upsert feature)
export const updateDefaultData = async (req, res, next) => {
    try {
        const { segment } = req.params;
        const { title, name, firstHead, boldParaContent, normalParagraph } = req.body;

        let imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

        let content = await GetModel.findOne({ segment });

        let updatedData = {
            segment,
            title: title || (content ? content.title : "DEFAULT TITLE"),
            name: name || (content ? content.name : segment),
            firstHead: firstHead || (content ? content.firstHead : "Default Head"),
            boldParaContent: boldParaContent || (content ? content.boldParaContent : "Default bold content"),
            normalParagraph: normalParagraph || (content ? content.normalParagraph : "Default normal paragraph")
        };

        if (imagePath) {
            updatedData.image = imagePath;
        } else if (content && content.image) {
            updatedData.image = content.image;
        } else {
            updatedData.image = "./assets/default.png";
        }

        const updatedContent = await GetModel.findOneAndUpdate(
            { segment }, 
            updatedData, 
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Content saved/updated successfully!",
            data: updatedContent
        });
    } catch (error) {
        next(error);
    }
};

// Segment anujayi data delete kariba
export const deleteDefaultData = async (req, res, next) => {
    try {
        const { segment } = req.params;
        const deletedContent = await GetModel.findOneAndDelete({ segment });

        if (!deletedContent) {
            return res.status(404).json({ success: false, message: "Content not found to delete!" });
        }

        res.status(200).json({
            success: true,
            message: "Content deleted successfully!"
        });
    } catch (error) {
        next(error);
    }
};